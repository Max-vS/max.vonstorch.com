"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// --- WebGL helpers -----------------------------------------------------------
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

// --- Shaders -----------------------------------------------------------------
const VERT = `
attribute vec2 aPos;
varying vec2 vUV;
void main() {
  vUV = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUV;
uniform sampler2D uTex;
uniform vec2 uResolution;
uniform vec2 uVideoSize;
uniform float uDotSize;
uniform float uAngle;
uniform vec3 uInkColor;

vec2 coverMap(vec2 uv, vec2 canvasSize, vec2 contentSize) {
  vec2 pos = (uv - 0.5) * canvasSize;
  float s = max(canvasSize.x / contentSize.x, canvasSize.y / contentSize.y);
  vec2 src = pos / s + 0.5 * contentSize;
  return src / contentSize;
}

vec2 rotate2D(vec2 p, float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c) * p;
}

void main() {
  vec2 uv = coverMap(vUV, uResolution, uVideoSize);
  vec3 vid = texture2D(uTex, uv).rgb;
  float lum = dot(vid, vec3(0.299, 0.587, 0.114));
  
  vec2 p = gl_FragCoord.xy - 0.5 * uResolution;
  p = rotate2D(p, uAngle);
  p += 0.5 * uResolution;
  
  vec2 g = p / max(uDotSize, 1.0);
  vec2 cell = fract(g) - 0.5;
  float radius = (1.0 - lum) * 0.5;
  float dist = length(cell);
  float feather = 0.35 / max(uDotSize, 1.0);
  float dotMask = 1.0 - smoothstep(radius, radius + feather, dist);
  
  // White background with colored dots
  vec3 color = mix(vec3(1.0), uInkColor, dotMask);
  gl_FragColor = vec4(color, 1.0);
}
`;

const INK_COLOR: [number, number, number] = [255 / 255, 31 / 255, 31 / 255];

// Device capability detection for adaptive quality
function getDeviceQuality() {
  if (typeof window === "undefined") return "high";

  const ua = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isLowEnd = /android.*chrome\/[0-5]\d/i.test(ua);

  // Check connection quality
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
    mozConnection?: { effectiveType?: string };
    webkitConnection?: { effectiveType?: string };
    deviceMemory?: number;
  };
  const connection =
    nav.connection || nav.mozConnection || nav.webkitConnection;
  const isSlowConnection =
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g";

  // Check device memory (if available)
  const deviceMemory = nav.deviceMemory;
  const isLowMemory = deviceMemory && deviceMemory < 4;

  if (isSlowConnection || isLowEnd) return "low";
  if (isMobile || isLowMemory) return "medium";
  return "high";
}

// Quality presets
const QUALITY_PRESETS = {
  low: { resScale: 0.5, dotSize: 8, fps: 24 },
  medium: { resScale: 0.65, dotSize: 6, fps: 30 },
  high: { resScale: 0.85, dotSize: 5, fps: 60 },
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface OptimizedShaderProps {
  videoSrc: string;
  startTime?: number;
  dotSize?: number;
  angle?: number;
  inkColor?: [number, number, number];
  adaptiveQuality?: boolean;
}

export default function Shader({
  videoSrc,
  startTime = 0,
  dotSize,
  angle = 68,
  inkColor = INK_COLOR,
  adaptiveQuality = true,
}: OptimizedShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  // Refs for GL resources
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const rafRef = useRef<number | null>(null);
  const rvfcIdRef = useRef<number | null>(null);

  // State refs
  const isVisibleRef = useRef(true);
  const isDocVisibleRef = useRef(
    typeof document !== "undefined" ? !document.hidden : true,
  );
  const needsUploadRef = useRef(false);
  const lastFrameTimeRef = useRef(0);
  const readyRef = useRef(false);

  // Get adaptive quality settings
  const quality = adaptiveQuality ? getDeviceQuality() : "high";
  const preset = QUALITY_PRESETS[quality];
  const effectiveDotSize = dotSize ?? preset.dotSize;
  const resScale = preset.resScale;
  const targetFrameTime = 1000 / preset.fps;

  const isActive = useCallback(
    () => isVisibleRef.current && isDocVisibleRef.current,
    [],
  );

  // Debounced resize handler
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setSize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr * resScale));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr * resScale));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }, [resScale]);

  const debouncedResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(setSize, 100);
  }, [setSize]);

  // Main render function
  const render = useCallback(() => {
    const gl = glRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const program = programRef.current;

    if (!gl || !program || !video || !canvas) return;
    if (!isActive()) return;

    // FPS limiting
    const now = performance.now();
    if (now - lastFrameTimeRef.current < targetFrameTime) return;
    lastFrameTimeRef.current = now;

    // Upload video texture if needed
    if (needsUploadRef.current && video.readyState >= 2) {
      const texture = textureRef.current;
      if (texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        try {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            video,
          );
          needsUploadRef.current = false;

          // Mark as ready after first successful upload
          if (!readyRef.current) {
            readyRef.current = true;
          }
        } catch {
          return;
        }
      }
    }

    // Render
    const vw = video.videoWidth || 1920;
    const vh = video.videoHeight || 1080;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    gl.uniform2f(
      gl.getUniformLocation(program, "uResolution"),
      canvas.width,
      canvas.height,
    );
    gl.uniform2f(gl.getUniformLocation(program, "uVideoSize"), vw, vh);
    gl.uniform1f(
      gl.getUniformLocation(program, "uDotSize"),
      effectiveDotSize * dpr,
    );
    gl.uniform1f(
      gl.getUniformLocation(program, "uAngle"),
      (angle * Math.PI) / 180,
    );
    gl.uniform3f(
      gl.getUniformLocation(program, "uInkColor"),
      inkColor[0],
      inkColor[1],
      inkColor[2],
    );

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [isActive, targetFrameTime, effectiveDotSize, angle, inkColor]);

  // Monitor ready state
  useEffect(() => {
    const interval = setInterval(() => {
      if (readyRef.current && !ready) {
        setReady(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [ready]);

  // Setup WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
      desynchronized: true,
    });

    if (!gl) {
      setFallback(true);
      return;
    }

    glRef.current = gl;

    // Setup GL state
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Create program
    const program = createProgram(gl, VERT, FRAG);
    if (!program) {
      setFallback(true);
      return;
    }
    programRef.current = program;
    // biome-ignore lint/correctness/useHookAtTopLevel: This is WebGL API, not a React hook
    gl.useProgram(program);

    // Setup geometry
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Setup texture
    const texture = gl.createTexture();
    textureRef.current = texture;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, "uTex"), 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Initial resize
    setSize();
    window.addEventListener("resize", debouncedResize, { passive: true });

    // Setup video frame callback
    const vv = video as HTMLVideoElement & {
      requestVideoFrameCallback?: (callback: () => void) => number;
      cancelVideoFrameCallback?: (id: number) => void;
    };
    if (typeof vv.requestVideoFrameCallback === "function") {
      const onFrame = () => {
        if (isActive()) {
          needsUploadRef.current = true;
          render();
        }
        rvfcIdRef.current = vv.requestVideoFrameCallback(onFrame);
      };
      rvfcIdRef.current = vv.requestVideoFrameCallback(onFrame);
    } else {
      // Fallback to RAF
      const loop = () => {
        if (isActive()) {
          needsUploadRef.current = true;
          render();
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (rvfcIdRef.current && vv.cancelVideoFrameCallback) {
        vv.cancelVideoFrameCallback(rvfcIdRef.current);
      }
      window.removeEventListener("resize", debouncedResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

      if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    };
  }, [setSize, debouncedResize, render, isActive]);

  // Video setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = startTime;

    const handleEnded = () => {
      video.currentTime = startTime;
      video.play().catch(() => {});
    };

    video.addEventListener("ended", handleEnded);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [startTime]);

  // Intersection observer
  useEffect(() => {
    const root = containerRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const obs = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? false;
        if (isActive()) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.01 },
    );

    obs.observe(root);
    return () => obs.disconnect();
  }, [isActive]);

  // Visibility change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onVisibilityChange = () => {
      isDocVisibleRef.current = !document.hidden;
      if (isActive()) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [isActive]);

  if (prefersReducedMotion()) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 right-0 bottom-0 -z-10 h-full w-full overflow-hidden pointer-events-none"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          !ready || fallback ? "opacity-100" : "opacity-0"
        }`}
      />

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
          fallback ? "hidden" : ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
