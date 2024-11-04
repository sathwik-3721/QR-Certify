import { uploadData,getDetails,sendCertificate,test } from "../controllers/qr.controller.js"
import express from 'express'
const router = express.Router();

const upload = multer({ 
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 512 } 
});

router.route('/uploadData', upload.single('image'))
	.post(uploadData);

router.route('/sendCertificate')
	.post(sendCertificate);

router.route('/getDetails')
	.get(getDetails)

router.route("/test")
	.get(test)

export default router;