import type { SceneId } from "./types";

export const indexColors = {
  ink: "#1D1D1B",
  ground: "#FAF8F4",
  red: "#E2573B",
  blue: "#2F4FD8",
  yellow: "#F2C14E",
  sage: "#9DB39A",
  pink: "#E9B8A6",
};

export const educationColors = {
  yellow: "#F2C14E",
  ink: "#1D1D1B",
  ground: "#FAF8F4",
  cream: "#F6DC97",
  ochre: "#C9962A",
};

export const dryftColors = {
  blue: "#1F3DFF",
  deep: "#131F71",
  tint: "#B5BAEC",
  ground: "#FAF8F4",
};

export const writingColors = {
  lavender: "#ADA2DD",
  violet: "#3E2C8A",
  ground: "#FAF8F4",
  ink: "#1D1D1B",
  yellow: "#F2C14E",
};

export const musicColors = {
  ink: "#1D1D1B",
  ground: "#FAF8F4",
  tangerine: "#FF6A13",
  peach: "#F7C7A6",
  rust: "#9C3A12",
};

export const linksColors = {
  chartreuse: "#C7F03A",
  black: "#111111",
  paper: "#F6EFE3",
  white: "#FFFFFF",
};

export const contactColors = {
  terracotta: "#E2573B",
  blush: "#E9B8A6",
  ground: "#FAF8F4",
  ink: "#1D1D1B",
  yellow: "#F2C14E",
};

export const notFoundColors = {
  red: "#D9432B",
  ground: "#FAF8F4",
  ink: "#1D1D1B",
  stone: "#CFCAC0",
};

export const titleColors: Record<SceneId, { bg: string; fg: string }> = {
  index: { bg: indexColors.ink, fg: indexColors.ground },
  education: { bg: educationColors.yellow, fg: educationColors.ink },
  projects: { bg: dryftColors.blue, fg: "#FFFFFF" },
  writing: { bg: writingColors.violet, fg: writingColors.ground },
  music: { bg: musicColors.tangerine, fg: musicColors.ink },
  links: { bg: linksColors.chartreuse, fg: linksColors.black },
  contact: { bg: contactColors.terracotta, fg: contactColors.ink },
  community: { bg: indexColors.ink, fg: indexColors.ground },
  notFound: { bg: notFoundColors.red, fg: notFoundColors.ground },
};
