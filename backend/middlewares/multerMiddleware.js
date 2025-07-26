// backend/middlewares/multerMiddleware.js

import multer from "multer";
import path from "path";

// Configure where and how files should be stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./temp"); // Store uploaded files in 'temp' directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Extract extension like '.mp4', '.jpg'
    const uniqueFileName = `${file.fieldname}-${timestamp}-${randomId}${ext}`;
    cb(null, uniqueFileName);
  }
});

// Set up Multer with storage config and file size limit
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024 // Max file size: 10GB
  }
});
