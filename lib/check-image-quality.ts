import { validateImage } from "image-validator";

export const ImageValidation = async (file: File) => {
  const isValidImage = await validateImage(file);
  console.log("valid image: ", isValidImage);
};
