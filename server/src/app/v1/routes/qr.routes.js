import { uploadData,sendCertificate,test } from "../controllers/qr.controller.js"
import express from 'express'
const router = express.Router();

router.route('/upload')
	.post(uploadData);

router.route('/sendCertificate')
	.post(sendCertificate);

router.route("/test")
	.get(test)

export default router;