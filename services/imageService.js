import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Image from '../models/imageModel.js';
import Request from '../models/requestModel.js';

const downloadImage = async (url, filePath) => {
  try {
    const response = await axios({
      url,
      responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on('finish', () => {
        console.log(`Downloaded ${url} to ${filePath}`);
        resolve();
      });
      writer.on('error', (error) => {
        console.error(`Error writing ${url} to ${filePath}:`, error);
        reject(error);
      });
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    throw error;
  }
};

const processImages = async (imageDoc) => {
  const outputUrls = [];
  for (const url of imageDoc.inputUrls) {
    try {
      const imagePath = path.resolve('uploads', `${uuidv4()}.jpg`);
      await downloadImage(url, imagePath);
      const outputPath = path.resolve('uploads', `processed-${uuidv4()}.jpg`);
      await sharp(imagePath).resize({ width: 800 }).toFile(outputPath);
      console.log(`Processed ${imagePath} to ${outputPath}`);
      outputUrls.push(outputPath); 
    } catch (error) {
      console.error(`Error processing image ${url}:`, error);
      outputUrls.push(null);
    }
  }
  imageDoc.outputUrls = outputUrls.filter(url => url !== null);
  console.log(`Final output URLs: ${imageDoc.outputUrls}`);
  imageDoc.status = 'completed';
  await imageDoc.save();
};

const startProcessing = async (requestId) => {
  try {
    const images = await Image.find({ requestId });
    for (const imageDoc of images) {
      imageDoc.status = 'processing';
      await imageDoc.save();
      await processImages(imageDoc);
    }
    const requestDoc = await Request.findOne({ requestId });
    requestDoc.status = 'completed';
    await requestDoc.save();
  } catch (error) {
    console.error('Error during startProcessing:', error);
    throw error;
  }
};

export { startProcessing };
