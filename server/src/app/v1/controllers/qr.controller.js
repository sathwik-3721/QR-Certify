import logger from "../../../../../logger.js";
import config from "../../../../../config.js";
import Qr from "../models/qr.model.js";
import { StatusCodes } from 'http-status-codes';

export async function uploadData(req, res) {
    try {
        const { name, email, image } = req.body;
        // const response = Qr.uploadData(name, email, image);
        // Decode the base64 image to a buffer
        const imageBuffer = Buffer.from(image, 'base64');
        console.log(req.body);

        const newQr = new Qr({
            name,
            email,
            image: imageBuffer,
        });

        await newQr.save();
        return res.status(StatusCodes.OK).send(response);
    } catch(error) {
        console.error("An error occurred in test function:", error);
        if (error.status) {
            res.status(error.status).send(error.message);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred");
        }
    }
}
