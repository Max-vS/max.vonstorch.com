import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";

const components = {
  h1: (props) => <h2 {...props} />,
  img: (props) => <Image {...(props as ImageProps)} />,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
