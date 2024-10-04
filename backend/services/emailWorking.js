import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function sendEmail({ from, to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_AUTH_LOGIN,
        pass: process.env.SMTP_AUTH_PASS,
      },
    });

    const emailStatus = await transporter.sendMail({
      from: `Dhanush <${from}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(emailStatus);
  } catch (error) {
    console.log(error);
  }
}

export default sendEmail;
