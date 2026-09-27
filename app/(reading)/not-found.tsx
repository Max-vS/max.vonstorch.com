import type { Metadata } from "next";
import Link from "next/link";
import { errors, writing } from "@/content/site";

export const metadata: Metadata = { title: errors.postNotFound };

// An unknown post streams its 404 into the reading layout, so it matches that layout instead of the tile-style 404.
export default function PostNotFound() {
  return (
    <>
      <h1 className="mb-10 font-bold text-4xl leading-tight tracking-tight sm:text-5xl">
        {errors.postNotFound}
      </h1>
      <Link
        href="/writing/archive"
        className="font-mono underline underline-offset-4 hover:opacity-60"
      >
        {writing.allPosts}
      </Link>
    </>
  );
}
