// Helpers for building optimized Cloudinary delivery URLs.
// If the URL isn't a Cloudinary one (e.g. the Unsplash demo images), it is
// returned unchanged so the gallery still works with mock data.

const isCloudinary = (url) => typeof url === 'string' && url.includes('/res.cloudinary.com/');

/**
 * Insert a transformation string right after `/upload/` in a Cloudinary URL.
 * e.g. .../upload/v123/foo.jpg → .../upload/<transform>/v123/foo.jpg
 */
function withTransform(url, transform) {
  if (!isCloudinary(url)) return url;
  return url.replace(/\/upload\//, `/upload/${transform}/`);
}

/**
 * Square-ish thumbnail for the gallery grid — small, fast, uniform.
 * c_fill keeps every tile the same shape; g_auto frames the best part.
 */
export const cldThumb = (url, size = 700) =>
  withTransform(url, `c_fill,g_auto,w_${size},h_${size},q_auto,f_auto`);

/**
 * Full-size, well-compressed version for the preview modal — keeps the
 * original aspect ratio (portrait or landscape) but capped & optimized.
 */
export const cldPreview = (url) =>
  withTransform(url, 'c_limit,w_1600,h_1600,q_auto:good,f_auto');
