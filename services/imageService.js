import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Image from '../models/imageModel.js';
import Request from '../models/requestModel.js';

const downloadImage = async (url, filePath) => {
  const response = await axios({
    url,
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const processImages = async (imageDoc) => {
  const outputUrls = [];
  for (const url of imageDoc.inputUrls) {
    const imagePath = path.resolve('uploads', `${uuidv4()}.jpg`);
    await downloadImage(url, imagePath);
    const outputPath = path.resolve('uploads', `processed-${uuidv4()}.jpg`);
    await sharp(imagePath).resize({ quality: 50 }).toFile(outputPath);
    outputUrls.push(outputPath);
  }
  imageDoc.outputUrls = outputUrls;
  imageDoc.status = 'completed';
  await imageDoc.save();
};

const startProcessing = async (requestId) => {
  const images = await Image.find({ requestId });
  for (const imageDoc of images) {
    imageDoc.status = 'processing';
    await imageDoc.save();
    await processImages(imageDoc);
  }
  const requestDoc = await Request.findOne({ requestId });
  requestDoc.status = 'completed';
  await requestDoc.save();
};

export { startProcessing };
