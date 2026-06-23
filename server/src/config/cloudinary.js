import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name',
  );

/**
 * Upload a file buffer (from multer memoryStorage) to Cloudinary.
 *
 * For images we apply an *incoming transformation* so the asset is compressed
 * and downscaled BEFORE it is stored — keeping us well within the free tier:
 *   - longest edge capped at 2000px (plenty for full-screen viewing)
 *   - quality: auto:good  → Cloudinary picks the smallest size with no visible loss
 *   - fetch_format: auto  → stored/served as WebP/AVIF where supported
 * In practice this lands typical photos at ~150–600 KB (far under 2 MB).
 *
 * @param {Buffer} buffer
 * @param {{ folder?: string, resourceType?: 'image'|'video'|'auto' }} opts
 * @returns {Promise<import('cloudinary').UploadApiResponse>}
 */
export function uploadBuffer(buffer, { folder = 'parijaiyi', resourceType = 'auto' } = {}) {
  const isImage = resourceType === 'image';
  const options = {
    folder,
    resource_type: resourceType,
    ...(isImage && {
      // Applied to the stored original (incoming transformation).
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' }, // only shrinks if larger; keeps aspect ratio
        { quality: 'auto:good', fetch_format: 'auto' },
      ],
    }),
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) =>
      err ? reject(err) : resolve(result),
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export function destroyAsset(publicId, resourceType = 'image') {
  if (!publicId) return Promise.resolve();
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export default cloudinary;
