import { Source_Serif_4 } from "next/font/google";

// Not in app/fonts.ts: the root layout imports that file, so every route would preload this font.
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-source-serif",
});
