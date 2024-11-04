import { uploadData } from "../controllers/qr.controller.js"
import express from 'express'
const router = express.Router();

router.route('/upload')
	.post(uploadData);

export default router;