import nodemailer from "nodemailer";
import { SendEmailCallback } from "../types/email";

const sendEmail = (
  email: string,
  subject: string,
  text: string,
  callback: SendEmailCallback
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  transporter.sendMail(
    {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject,
      text,
    },
    callback
  );
};

export default sendEmail;
