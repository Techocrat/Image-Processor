import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

import imageRoutes from './routes/imageRoutes.js';
import statusRoutes from './routes/statusRoutes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use('/api/images', imageRoutes);
app.use('/api', statusRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
