import express from 'express';
import multer from 'multer';
import { uploadImage, getResourcesByTag, deleteResource } from '../controller/cloudinaryController.js';

const router = express.Router();

// Multer config for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public route to fetch resources
router.get('/list/:tag', getResourcesByTag);

// Protected routes for uploading and deleting
router.post('/upload', upload.single('file'), uploadImage);
router.post('/delete', deleteResource);

export default router;
