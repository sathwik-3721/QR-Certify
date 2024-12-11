import nodemailer from "nodemailer";
import multer from "multer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import path from "path";
import fs from "fs";
import * as fontkit from 'fontkit';
import dotenv from "dotenv";
dotenv.config();


const generatePdf = async (data) => {
    const certificateImagePath = path.resolve("./TechTalks_Certificate.jpg");
    
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    // const fontBytes = await fetch("fonts/Montserrat-Regular.ttf").then((res) => res.arrayBuffer());
    // const fontBytes = await loadFont('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
    const fontBytes = fs.readFileSync('./fonts/Montserrat-Regular.ttf');  
    const fontBoldBytes = fs.readFileSync('./fonts/Montserrat-Bold.ttf');
    const alexFontBytes = fs.readFileSync('./fonts/AlexBrush-Regular.ttf');
  // Embed the custom font
    const montserratFont = await pdfDoc.embedFont(fontBytes);
    const montserratBoldFont = await pdfDoc.embedFont(fontBoldBytes);
    const alexBrushFont = await pdfDoc.embedFont(alexFontBytes)

    // Embed the Roboto font
    // const montserratFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // const montserratFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
    // Add a new page with landscape orientation
    const page = pdfDoc.addPage([1000, 650]); // A4 size: [width, height]
  
    // Set the background image
    const imageBuffer = fs.readFileSync(certificateImagePath);
    const backgroundImage = await pdfDoc.embedJpg(imageBuffer);
  
    page.drawImage(backgroundImage, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });
  
    // Draw name
    page.drawText(data.name, {
      x: page.getWidth() / 2 - montserratFont.widthOfTextAtSize(data.name, 30) / 2,
      y: 395,
      size: 50,
      font: alexBrushFont,
      color: rgb(1, 1, 1),
    });
  
    // Draw certificate content
    const lineSegments = [
      { text: "Attended ", font: montserratFont, size: 18 },
      { text: `${data.event}`, font: montserratBoldFont, size: 18 },
      { text: "in ", font: montserratFont, size: 18 },
      { text: "Digital Summit'24 ", font: montserratBoldFont, size: 18 }, // Bold text
      { text: "from ", font: montserratFont, size: 18 },
      { text: "December 19-21st, 2024", font: montserratBoldFont, size: 18 }, // Bold text
      { text: " at Miracle City Vizianagaram (AP)", font: montserratFont, size: 18 },
      {
        text: '{"Generative AI", "Data and Analytics", "Cloud and Digital Applications", ',
        font: montserratFont,
        size: 18,
      },
      {
        text: '"Cybersecurity", "Automation", "IOT"}',
        font: montserratFont,
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
  
    let yPosition = 355; // Fixed y-position for all segments
  
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
        color: i >= 7 ? rgb(0.5, 0.5, 0.5) : rgb(1, 1, 1),
      });
  
      // Move xPosition to the right for the next segment
      i < 2 || i >= 6
        ? (yPosition -= 25)
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
    /* cyrillic-ext */
    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUQjIg1_i6t8kCHKm459WxRxC7mw9c.woff2) format('woff2');
      unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
    }
    /* cyrillic */
    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUQjIg1_i6t8kCHKm459WxRzS7mw9c.woff2) format('woff2');
      unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUQjIg1_i6t8kCHKm459WxRxi7mw9c.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUQjIg1_i6t8kCHKm459WxRxy7mw9c.woff2) format('woff2');
      unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUQjIg1_i6t8kCHKm459WxRyS7m.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    /* cyrillic-ext */
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2) format('woff2');
      unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
    }
    /* cyrillic */
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm459W1hyzbi.woff2) format('woff2');
      unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
    }
    /* vietnamese */
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm459WZhyzbi.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
    }
    /* latin-ext */
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm459Wdhyzbi.woff2) format('woff2');
      unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }
    /* latin */
    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
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
        // attachments: [
        //   {
        //     filename: "Participation-Certificate.pdf", // Name the file
        //     content: certificateBytes,
        //   },
        // ],
      };
  
      const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        requireTLS:false,
        port : 587,
        secure : false,
        logger:true,
        debug:true,
        auth: {
          user: process.env.APP_MAIL_USER,
          pass: process.env.APP_MAIL_PASSWORD,
        },
        tls : {
          rejectUnauthorized : false
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

    }
  };

const details = {
    name : "Revathipathi Lanka",
    event : "Integrating Gemini APIs with Python and Building a Chatbot App with Streamlit/Chainlit UI",
    email : "revathipathilanka347@gmail.com"
}

// generatePdf(details);
sendCertificate(details);
console.log(process.env.APP_MAIL_USER)