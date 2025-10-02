import { validateImage } from "image-validator";

export const ImageValidation = async (file: File) => {
  const isValidImage = await validateImage(file);
  if (isValidImage) {
    return "Good";
  } else {
    return "Poor";
  }
};
