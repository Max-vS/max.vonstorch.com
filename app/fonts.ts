import { Familjen_Grotesk, JetBrains_Mono } from "next/font/google";

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const fontVariables = `${familjenGrotesk.variable} ${jetbrainsMono.variable}`;
