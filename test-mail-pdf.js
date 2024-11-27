import nodemailer from "nodemailer";
import multer from "multer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import path from "path";
import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

const generatePdf = async (data) => {
    const certificateImagePath = path.resolve("./certificate-bg2.png");
  
    const pdfDoc = await PDFDocument.create();
    // Embed the Roboto font
    const robotoFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const robotoBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
    // Add a new page with landscape orientation
    const page = pdfDoc.addPage([842, 595]); // A4 size: [width, height]
  
    // Set the background image
    const imageBuffer = fs.readFileSync(certificateImagePath);
    const backgroundImage = await pdfDoc.embedPng(imageBuffer);
  
    page.drawImage(backgroundImage, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
  
    // Draw name
    page.drawText(data.name, {
      x: page.getWidth() / 2 - robotoFont.widthOfTextAtSize(data.name, 30) / 2,
      y: 370,
      size: 30,
      font: robotoFont,
      color: rgb(0, 0, 0),
    });
  
    // Draw certificate content
    const lineSegments = [
      { text: "Attended ", font: robotoFont, size: 18 },
      { text: `${data.event}`, font: robotoFont, size: 18 },
      { text: "in ", font: robotoFont, size: 18 },
      { text: "Digital Summit'24 ", font: robotoBoldFont, size: 18 }, // Bold text
      { text: "from ", font: robotoFont, size: 18 },
      { text: "December 19-21st, 2024", font: robotoBoldFont, size: 18 }, // Bold text
      { text: " at Miracle City", font: robotoFont, size: 18 },
      { text: "Vizianagaram (AP)", font: robotoFont, size: 18 },
      {
        text: '"Generative AI", "Data and Analytics", "Cloud and Digital Applications", "Cybersecurity", ',
        font: robotoFont,
        size: 18,
      },
      {
        text: '"Automation", "IOT"',
        font: robotoFont,
        size: 18,
      },
    ];
  
    // Starting x position (you can adjust this based on the required alignment)
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
  
    let yPosition = 330; // Fixed y-position for all segments
  
    // Draw each segment in sequence on the same line
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
  
      // Move xPosition to the right for the next segment
      i < 2 || i >= 6
        ? (yPosition -= 30)
        : (xPosition += segment.font.widthOfTextAtSize(
            segment.text,
            segment.size
          ));
      i++;
    }
  
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('output.pdf', pdfBytes);
    return pdfBytes;
  };

const sendCertificate = async (details) => {
    try {
      const { name, email, event } = details;
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
  <body style="background-color: #f4f4f4; padding: 20px; margin: 0;">
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
        //   return res.status(StatusCodes.CONFLICT).send("could not send mail");
        } else {
        //   await updateCertificateStatus(name, email, event);
          console.log("Email sent successfully");
        //   return res.status(StatusCodes.OK).send("Send mail successfully");
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

const details = {
    name : "Rvathipathi",
    event : "Integrating Gemini APIs with Python and Building a Chatbot App with Streamlit/Chainlit UI",
    email : "revathipathilanka347@gmail.com"
}

// generatePdf(details);
sendCertificate(details);
console.log(process.env.APP_MAIL_USER)