import type { SceneId } from "./types";

export const indexColors = {
  ink: "#1D1D1B",
  ground: "#EFEBE4",
  red: "#E2573B",
  blue: "#2F4FD8",
  yellow: "#F2C14E",
  sage: "#9DB39A",
  pink: "#E9B8A6",
};

export const educationColors = {
  yellow: "#F2C14E",
  ink: "#1D1D1B",
  ground: "#EFEBE4",
  cream: "#F6DC97",
  ochre: "#C9962A",
};

export const dryftColors = {
  blue: "#1F3DFF",
  // mix(blue, #0B0D1A, 0.62)
  deep: "#131F71",
  // mix(blue, #EFEBE4, 0.72)
  tint: "#B5BAEC",
  ground: "#EFEBE4",
};

export const writingColors = {
  sage: "#8FA98A",
  forest: "#33503A",
  ground: "#EFEBE4",
  ink: "#1D1D1B",
  clay: "#D9A08B",
};

export const musicColors = {
  ink: "#1D1D1B",
  ground: "#EFEBE4",
  tangerine: "#FF6A13",
  peach: "#F7C7A6",
  rust: "#9C3A12",
};

export const cvColors = {
  chartreuse: "#C7F03A",
  black: "#111111",
  paper: "#F6EFE3",
  white: "#FFFFFF",
};

export const contactColors = {
  terracotta: "#E2573B",
  blush: "#E9B8A6",
  ground: "#EFEBE4",
  ink: "#1D1D1B",
  yellow: "#F2C14E",
};

export const notFoundColors = {
  red: "#D9432B",
  ground: "#EFEBE4",
  ink: "#1D1D1B",
  stone: "#CFCAC0",
};

export const titleColors: Record<SceneId, { bg: string; fg: string }> = {
  index: { bg: indexColors.ink, fg: indexColors.ground },
  education: { bg: educationColors.yellow, fg: educationColors.ink },
  projects: { bg: dryftColors.blue, fg: "#FFFFFF" },
  writing: { bg: writingColors.forest, fg: writingColors.ground },
  music: { bg: musicColors.tangerine, fg: musicColors.ink },
  cv: { bg: cvColors.chartreuse, fg: cvColors.black },
  contact: { bg: contactColors.terracotta, fg: contactColors.ink },
  community: { bg: indexColors.pink, fg: indexColors.ink },
  notFound: { bg: notFoundColors.red, fg: notFoundColors.ground },
};
