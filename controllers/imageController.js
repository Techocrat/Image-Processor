import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Image from '../models/imageModel.js';
import Request from '../models/requestModel.js';
import { startProcessing } from '../services/imageService.js';
import { notifyCompletion, connectNats } from '../services/webhookService.js';

const upload = multer({ dest: 'uploads/' });

const handleCSV = (filePath, requestId) => {
  const images = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        images.push({
          requestId,
          productName: row['Product Name'],
          inputUrls: row['Input Image Urls'].split(','),
        });
      })
      .on('end', async () => {
        try {
          await Image.insertMany(images);
          console.log('Images inserted:', images);
          resolve();
        } catch (error) {
          console.error('Error inserting images:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
};

const uploadCSV = async (req, res) => {
  const requestId = uuidv4();
  const requestDoc = new Request({ requestId });
  await requestDoc.save();

  try {
    await handleCSV(req.file.path, requestId);
    startProcessing(requestId);
    const nc = await connectNats();
    notifyCompletion(nc, requestId);
    res.status(200).json({ requestId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process CSV' });
  }
};

export { upload, uploadCSV };
