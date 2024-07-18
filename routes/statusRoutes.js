import express from 'express';
import { checkStatus } from '../controllers/statusController.js';
const router = express.Router();

router.get('/status/:requestId', checkStatus);

export default router;
