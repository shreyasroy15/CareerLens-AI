import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

// Configure Cloudinary SDK with environment variables
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  );
};

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

/**
 * Uploads a file (PDF, DOCX, or Image) to Cloudinary
 */
export const uploadToCloudinary = async (
  filePath: string,
  folder = 'careerlens/resumes'
): Promise<CloudinaryUploadResult> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Please check your environment variables.');
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true,
  });

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    bytes: result.bytes,
  };
};

/**
 * Removes a file from Cloudinary by its public ID
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'raw' | 'video' = 'raw'
): Promise<void> => {
  if (!isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err: any) {
    console.error(`[Cloudinary Warning] Failed to delete ${publicId}:`, err.message);
  }
};

export { cloudinary };
