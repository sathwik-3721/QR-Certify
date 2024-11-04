import logger from "../../../../../logger.js";
import config from "../../../../../config.js";
import Qr from "../models/qr.model.js";
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';

// Configure multer
const upload = multer();

// Middleware to handle file uploads
export const uploadData = [
    upload.single('image'), // This will process the image field from the form data
    async (req, res) => {
        try {
            const { name, email } = req.body; // Get name and email from body
            const imageBuffer = req.file?.buffer; // Get the image buffer from multer

            // Debugging output
            console.log("Received Name:", name);
            console.log("Received Email:", email);
            console.log("Received Image Buffer:", imageBuffer);

            if (!imageBuffer) {
                return res.status(StatusCodes.BAD_REQUEST).send("Image is required");
            }

            // Create a new document with the parsed data
            const newQr = new Qr({
                name,
                email,
                image: imageBuffer,
            });

            await newQr.save(); // Save the document to MongoDB
            return res.status(StatusCodes.OK).send({ message: 'Data uploaded successfully', newQr });
        } catch (error) {
            console.error("An error occurred in uploadData function:", error);
            if (error.status) {
                res.status(error.status).send(error.message);
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred");
            }
        }
    }
];
