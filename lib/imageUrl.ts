/**
 * Normalises an image_url from the backend.
 *
 * The DB stores paths as "./media/foo.jpg" (relative). Next.js serves those
 * files from the public/ directory at "/media/foo.jpg". A bare "./"-prefixed
 * path is resolved relative to the current page URL by the browser, landing
 * on e.g. "/articles/1/media/foo.jpg" which 404s.
 *
 * Absolute http(s) URLs are returned unchanged.
 */
export function resolveImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  // ./media/foo.jpg  →  /media/foo.jpg
  return imageUrl.replace(/^\.\//, "/");
}
