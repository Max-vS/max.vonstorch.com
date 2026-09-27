import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";

const components = {
  // rehype-mdx-import-media turns local image paths into static imports, and only next/image reads their size.
  img: (props) => <Image {...(props as ImageProps)} />,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
