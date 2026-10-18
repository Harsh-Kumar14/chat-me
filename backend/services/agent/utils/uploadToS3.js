import cloudinary from "../config/cloudinary.js";
import supabase from "../config/supabase.js";

const getPublicId = (filename) =>
  filename.replace(/\.[^/.]+$/, "");

export const uploadToS3 = async (filename, buffer, contentType) => {
  if (contentType.startsWith("image/")) {
    const publicId = getPublicId(filename);

    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: "image",
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Image upload failed"));
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    return filename;
  }

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .upload(filename, buffer, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  return filename;
};