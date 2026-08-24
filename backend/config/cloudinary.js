import dotenv from 'dotenv';
dotenv.config(); // Must be first

import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.VITE_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.VITE_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ CLOUDINARY ERROR: Missing credentials in .env file!');
} else {
  console.log('✅ CLOUDINARY: Configured successfully');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
