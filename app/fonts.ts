import { Familjen_Grotesk, JetBrains_Mono } from "next/font/google";

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Here, not in the root layout: global-error replaces the layout's <html> and needs them too.
export const fontVariables = `${familjenGrotesk.variable} ${jetbrainsMono.variable}`;
