import {
  shareImage,
  shareImageAlt,
  shareImageSize,
} from "@/components/share-image";
import { pages, writing } from "@/content/site";

const page = { ...pages.writing, title: writing.archive.title };

export const alt = shareImageAlt(page);
export const size = shareImageSize;
export const contentType = "image/png";

export default function Image() {
  return shareImage(page);
}
