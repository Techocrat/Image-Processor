import express from 'express';
import { upload, uploadCSV } from '../controllers/imageController.js';
const router = express.Router();

router.post('/upload', upload.single('file'), uploadCSV);

export default router;
