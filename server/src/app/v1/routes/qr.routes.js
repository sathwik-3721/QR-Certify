import { uploadData,getDetails,sendCertificate,test } from "../controllers/qr.controller.js"
import express from 'express'
const router = express.Router();


router.route('/uploadData')
	.post(uploadData);

router.route('/sendCertificate')
	.post(sendCertificate);

router.route('/getDetails')
	.get(getDetails)

router.route("/test")
	.get(test)

export default router;