//backend/utils/cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("Local file path is required");
        }

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            media_metadata: true
        });

        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        // Log the error
        console.error("Error uploading file:", error.message);

        // Ensure the local file exists before attempting to unlink it
        if (fs.existsSync(localFilePath)) {
            // Remove the locally saved temporary file as the upload operation failed
            fs.unlinkSync(localFilePath);
        }

        // Return an object with an error message
        return { error: error.message };
    }
};

export { uploadOnCloudinary };
