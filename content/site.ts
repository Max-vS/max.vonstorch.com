import type { Route } from "next";
import type { BrushColor, BrushShape } from "@/lib/schemas/mark";
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
    kicker: "Yo",
    title: "Max von Storch",
    description:
      "Max von Storch is a full-stack engineer, designer and founder. Founding engineer at Dryft in San Francisco, building AI for manufacturing.",
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
  body: "Founding engineer at Dryft, building AI for manufacturing. Passionate about music, film, design, philosophy and building things people actually love to use. I believe in honesty, authenticity and creativity.",
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
  intro: "My top 3 tracks lately:",
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
  empty: "Be the first to leave your mark.",
  loadError: "Marks cannot load right now.",
  start: "Leave your mark",
  // The design prints the date in mixed case, so these are not uppercased in CSS.
  count: (n: number, total: number) => `MARK ${n} / ${total}`,
  thanks: "THANK YOU",
  waiting: "Waiting for approval",
  thanksStatus: "Thank you. Your mark is waiting for approval.",
  position: (n: number, total: number) => `Mark ${n} of ${total}`,
  anonymous: "Anonymous",
  yourMark: "Your mark",
  paintArea: "Your mark, 4 by 4 tiles. Arrow keys move, Enter paints.",
  paintCell: (row: number, col: number) => `Row ${row}, column ${col}`,
  brush: {
    shape: "Shape",
    colour: "Colour",
    ground: "Ground",
  },
  shapes: {
    qdisc: "Quarter disc",
    half: "Half disc",
    tri: "Triangle",
    dot: "Dot",
    qring: "Quarter ring",
    leaf: "Leaf",
    squares: "Square",
    arc: "Arcs",
  } satisfies Record<BrushShape, string>,
  colours: {
    "#E2573B": "Red",
    "#2F4FD8": "Blue",
    "#F2C14E": "Yellow",
    "#9DB39A": "Sage",
    "#1D1D1B": "Black",
    "#E9B8A6": "Pink",
    "#EFEBE4": "Off-white",
  } satisfies Record<BrushColor, string>,
  name: "Name",
  namePlaceholder: "Your name (optional)",
  note: "Note",
  notePlaceholder: "Leave a note…",
  noteLeft: "characters left",
  submit: "Submit mark",
  sending: "Sending…",
  cancel: "Cancel",
  // Spec §15: the same message for the rate limit and the pending cap; a bot learns nothing.
  tooMany: "Too many marks right now. Try again later.",
  failed: "Your mark could not be sent. Try again later.",
};

export const errors = {
  notFound: {
    kicker: "Error 404",
    title: "Not found",
    body: "This page does not exist, or it moved.",
  },
  failed: {
    kicker: "Something went wrong",
    title: "Error",
    body: "This page could not load.",
  },
  postNotFound: "Post not found",
  retry: "Try again",
  home: "Back to the index →",
};
