import cloudinary from "../config/cloudinary";

const DATA_URI_PREFIX = "data:";

const normalizeToDataUri = (input: string) => {
  if (input.startsWith(DATA_URI_PREFIX)) {
    return input;
  }
  return `data:image/jpeg;base64,${input}`;
};

export const uploadBase64Image = async (
  image: string,
  folder: string
): Promise<string> => {
  const trimmed = image.trim();

  if (trimmed.startsWith("http")) {
    return trimmed;
  }

  const uploadResponse = await cloudinary.uploader.upload(
    normalizeToDataUri(trimmed),
    {
      folder,
      transformation: [{ quality: "auto:best" }],
    }
  );

  return uploadResponse.secure_url;
};

