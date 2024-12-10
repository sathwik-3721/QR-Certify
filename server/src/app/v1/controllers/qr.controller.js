import dotenv from "dotenv";
dotenv.config();
// import Qr from "../models/qr.model.js";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import multer from "multer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import path from "path";
import fs from "fs";
import * as fontkit from 'fontkit';


// Middleware to handle file uploads
// export const uploadData = async (req, res) => {
//   try {
//     const { name, email, event, image } = req.body; // Get name and email from body
//     const result = await Qr.findOne({ name, email, event });
//     if (result) {
//       throw { status: StatusCodes.CONFLICT, message: "User already exists" };
//     }
//     const newQr = new Qr({
//       name,
//       email,
//       event,
//       image,
//     });

//     await newQr.save(); // Save the document to MongoDB
//     return res
//       .status(StatusCodes.OK)
//       .send({ message: "Data uploaded successfully", newQr });
//   } catch (error) {
//     console.error("An error occurred in uploadData function:", error);
//     if (error.status) {
//       res.status(error.status).send(error.message);
//     } else {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred");
//     }
//   }
// };

// const updateCertificateStatus = async (name, email, event) => {
//   try {
//     const response = await Qr.updateOne(
//       { name, email, event },
//       { $set: { issued: true } }
//     );

//     // Check if the update was successful
//     if (response.matchedCount === 0) {
//       throw {
//         status: 404, // Not Found
//         message: "No matching document found.",
//       };
//     }

//     if (response.modifiedCount === 0) {
//       throw {
//         status: 204, // No Content (document found but no changes made)
//         message: "Document found but no update made.",
//       };
//     }

//     return {
//       status: 200, // OK
//       message: "Certificate status updated successfully.",
//     };
//   } catch (err) {
//     // Catch any errors that occurred during the update
//     throw {
//       status: 500, // Internal Server Error
//       message: "An error occurred while updating the certificate status.",
//       error: err.message,
//     };
//   }
// };

const generatePdf = async (data) => {
  const certificateImagePath = path.resolve("./certificate-bg2.png");
  
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = fs.readFileSync('./fonts/Montserrat-Medium.ttf');  
  const fontBoldBytes = fs.readFileSync('./fonts/Montserrat-Bold.ttf');  

  const montserratFont = await pdfDoc.embedFont(fontBytes);
  const montserratBoldFont = await pdfDoc.embedFont(fontBoldBytes);

  const page = pdfDoc.addPage([1000, 650]); 


  const imageBuffer = fs.readFileSync(certificateImagePath);
  const backgroundImage = await pdfDoc.embedPng(imageBuffer);

  page.drawImage(backgroundImage, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  });


  page.drawText(data.name, {
    x: page.getWidth() / 2 - montserratFont.widthOfTextAtSize(data.name, 30) / 2,
    y: 405,
    size: 30,
    font: montserratFont,
    color: rgb(0, 0, 0),
  });

  const lineSegments = [
    { text: "Attended ", font: montserratFont, size: 18 },
    { text: `${data.event}`, font: montserratFont, size: 18 },
    { text: "in ", font: montserratFont, size: 18 },
    { text: "Digital Summit'24 ", font: montserratBoldFont, size: 18 }, // Bold text
    { text: "from ", font: montserratFont, size: 18 },
    { text: "December 19-21st, 2024", font: montserratBoldFont, size: 18 }, // Bold text
    { text: " at Miracle City", font: montserratFont, size: 18 },
    { text: "Vizianagaram (AP)", font: montserratFont, size: 18 },
    {
      text: '"Generative AI", "Data and Analytics", "Cloud and Digital Applications", ',
      font: montserratFont,
      size: 18,
    },
    {
      text: '"Cybersecurity", "Automation", "IOT"',
      font: montserratFont,
      size: 18,
    },
  ];

  let xPosition =
    (page.getWidth() -
      lineSegments
        .slice(2, 7)
        .reduce(
          (acc, segment) =>
            acc + segment.font.widthOfTextAtSize(segment.text, segment.size),
          0
        )) /
    2;

  let yPosition = 360; 

  let i = 0;
  for (const segment of lineSegments) {
    page.drawText(segment.text, {
      x:
        i < 2 || i > 6
          ? page.getWidth() / 2 -
            segment.font.widthOfTextAtSize(segment.text, segment.size) / 2
          : xPosition,
      y: yPosition,
      size: segment.size,
      font: segment.font,
      color: i >= 8 ? rgb(0.5, 0.5, 0.5) : rgb(0, 0, 0),
    });

    i < 2 || i >= 6
      ? (yPosition -= 30)
      : (xPosition += segment.font.widthOfTextAtSize(
          segment.text,
          segment.size
        ));
    i++;
  }

  const pdfBytes = await pdfDoc.save();
  // fs.writeFileSync('output.pdf', pdfBytes);
  return pdfBytes;
};

export const sendCertificate = async (req, res) => {
  try {
    const { name, email, event } = req.body;
    console.log("email", name,email,event);
    const certificateBytes = await generatePdf({ name, event });
    // const pdfBuffer = req.file.buffer; // Access the uploaded PDF file in memory
    // const fileName = req.file.originalname; // Get the original filename

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You Email</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <style>
        *{
            font-family: 'Montserrat',sans-serif;
        }
    </style>
</head>
<body style="font-family: 'Montserrat', sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
    <!-- Header -->
    <tr>
      <td style="background-color: #00aae7; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Thank You for Participating!</h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 20px;">
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Dear ${name},
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          We would like to extend our sincere thanks for your participation in ${event}. Your engagement and enthusiasm contributed significantly to the success of the event.
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          As a token of our appreciation, we are pleased to attach your participation certificate. Please find it attached to this email.
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          We hope to see you again at future events. If you have any feedback or suggestions, feel free to reach out to us.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 14px; color: #777777;">
        <p style="margin: 0;">© 2024 Miracle Software Systems, Inc. All Rights Reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
    const mailDetails = {
      from: process.env.APP_MAIL_USER,
      to: email,
      subject: "Participation Certificate",
      html,
      attachments: [
        {
          filename: "Participation-Certificate.pdf", // Name the file
          content: certificateBytes,
        },
      ],
    };

    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_MAIL_USER,
        pass: process.env.APP_MAIL_PASSWORD,
      },
    });

    mailTransporter.sendMail(mailDetails, async function (err, data) {
      if (err) {
        console.log("Error Occurs", err);
        return res.status(StatusCodes.CONFLICT).send("could not send mail");
      } else {
        await updateCertificateStatus(name, email, event);
        console.log("Email sent successfully");
        return res.status(StatusCodes.OK).send("Send mail successfully");
      }
    });
    // return res.status(200).send("mail sent")
  } catch (error) {
    console.error("An error occurred in uploadData function:", error);
    if (error.status) {
      res.status(error.status).send(error.message);
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred");
    }
  }
};

// export async function getDetails(req, res) {
//   try {
//     const { name, email, event } = req.query;
//     const result = await Qr.findOne({ name, email, event });
//     console.log(result);
//     if (result) {
//       return res.status(200).send(result);
//     }
//     // throw {status : 404 , message : "User details not found"}
//   } catch (error) {
//     console.error("An error occurred in uploadData function:", error);
//     if (error.status) {
//       res.status(error.status).send(error.message);
//     } else {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred");
//     }
//   }
// }

export async function test(req, res) {
  res.status(StatusCodes.OK).send("test successfully");
}