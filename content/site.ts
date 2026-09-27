import type { Route } from "next";
import type { PageId } from "@/lib/tiles/types";

export type SitePage = {
  id: PageId;
  path: Route;
  label: string;
  kicker: string;
  title: string;
  description: string;
};

// Keys are in nav order.
export const pages: Record<PageId, SitePage> = {
  index: {
    id: "index",
    path: "/",
    label: "Index",
    kicker: "Founding engineer · San Francisco",
    title: "Max von Storch",
    description:
      "Max von Storch is a founding engineer at Dryft in San Francisco, building AI for manufacturing.",
  },
  education: {
    id: "education",
    path: "/education",
    label: "Education",
    kicker: "Computer Science & Philosophy",
    title: "Education",
    description:
      "Max von Storch studied computer science at TU Munich, CSEE and UC Berkeley, and philosophy at HFPH.",
  },
  projects: {
    id: "projects",
    path: "/projects",
    label: "Projects",
    kicker: "Dryft & side projects",
    title: "Projects",
    description:
      "Dryft, where Max von Storch builds AI for manufacturing, and his side projects Rémi.fr, OpenEU and curava.",
  },
  writing: {
    id: "writing",
    path: "/writing",
    label: "Writing",
    kicker: "Notes & essays",
    title: "Writing",
    description: "Notes and essays by Max von Storch.",
  },
  music: {
    id: "music",
    path: "/music",
    label: "Music",
    kicker: "What I listen to",
    title: "Music",
    description: "The tracks Max von Storch listens to most right now.",
  },
  cv: {
    id: "cv",
    path: "/cv",
    label: "CV",
    kicker: "Résumé · one page",
    title: "CV",
    description:
      "The résumé of Max von Storch: experience, education and skills on one page.",
  },
  contact: {
    id: "contact",
    path: "/contact",
    label: "Contact",
    kicker: "Because it is and always will be about people",
    title: "Contact",
    description: "Find Max von Storch on GitHub and LinkedIn.",
  },
  community: {
    id: "community",
    path: "/community",
    label: "Community",
    kicker: "Leave your mark",
    title: "Community",
    description:
      "A wall of tile patterns that visitors left for Max von Storch.",
  },
};

export const index = {
  body: "Currently founding engineer at Dryft, building AI for manufacturing.",
};

export const education = {
  body: "Computer science at TU Munich, CSEE and UC Berkeley. Philosophy at HFPH.",
};

export const projects = {
  body: "Founding engineer at Dryft, building AI for manufacturing.",
  sideProjects: [
    { label: "Rémi.fr", href: "https://www.xn--rmi-bma.fr/" },
    { label: "OpenEU", href: "https://openeu.csee.tech/" },
    { label: "curava", href: "https://www.curava.eu/" },
  ],
  dryft: { label: "dryft.ai ↗", href: "https://dryft.ai" },
};

export const writing = {
  allPosts: "All posts →",
  archive: {
    title: "All posts",
    description: "All notes and essays by Max von Storch, newest first.",
  },
  feedTitle: "Writing | Max von Storch",
};

export const music = {
  // Phase 9 shows the live Spotify tracks and keeps this as the fallback.
  fallback: "Spotify is quiet right now.",
};

export const cv = {
  body: "Experience, education and skills on one page.",
  download: {
    label: "DOWNLOAD CV · PDF ↓",
    href: "/cv.pdf",
    // TODO(owner): set the month together with public/cv.pdf (spec §8 checklist).
    updated: "UPDATED [MONTH YYYY]",
  },
};

// TODO(owner): the X profile is still missing (spec §8 checklist); Contact lists it once this is set.
const X_PROFILE_URL_TODO: string | undefined = undefined;

export const contact = {
  links: [
    { label: "GitHub", href: "https://github.com/Max-vS" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/maxvonstorch/" },
    ...(X_PROFILE_URL_TODO ? [{ label: "X", href: X_PROFILE_URL_TODO }] : []),
  ],
};

export const community = {
  // Phase 8 adds the marks and the paint mode.
  empty: "Be the first to leave your mark.",
};
