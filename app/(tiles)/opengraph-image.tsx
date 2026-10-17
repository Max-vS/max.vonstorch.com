import {
  shareImage,
  shareImageAlt,
  shareImageSize,
} from "@/components/share-image";
import { pages } from "@/content/site";

export const alt = shareImageAlt(pages.index);
export const size = shareImageSize;
export const contentType = "image/png";

export default function Image() {
  return shareImage(pages.index);
}
