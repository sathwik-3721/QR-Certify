import { uploadData } from "../controllers/qr.controller.js"
import express from 'express'
import multer from 'multer'
import fs from 'fs'

const router = express.Router();

const uploadFolder = './uploads';

if (!fs.existsSync(uploadFolder)) {
	fs.mkdirSync(uploadFolder);
}
  
const storage = multer.memoryStorage();
  
const upload = multer({ 
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 512 } 
});

router.route('/upload', upload.single('image'))
	.post(uploadData);

export default router;