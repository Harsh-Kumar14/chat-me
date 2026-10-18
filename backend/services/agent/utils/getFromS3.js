import cloudinary from "../config/cloudinary.js";
import supabase from "../config/supabase.js";

const getPublicId = (filename) =>
  filename.replace(/\.[^/.]+$/, "");

const isImage = (filename) =>
  /\.(png|jpe?g|webp|gif|avif)$/i.test(filename);

export const getFromS3 = async (filename, expiresIn = 3600) => {
  if (isImage(filename)) {
    return cloudinary.url(getPublicId(filename), {
      secure: true,
      resource_type: "image",
    });
  }

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .createSignedUrl(filename, expiresIn);

  if (error) throw error;

  return data.signedUrl;
};