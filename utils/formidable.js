import fs from "fs";
import formidable from "formidable";

import path from "path";
export const getFormDataWithFormidable = async (req) => {
  const uploadDir = path.join("/tmp", "uploads");
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    throw new Error("Server configuration error :" + (err.message || ""));
  }

  // Configure formidable
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
  });

  //formidable ile gönderilen veriyi alıyoruz
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });

  return [fields, files];
};
