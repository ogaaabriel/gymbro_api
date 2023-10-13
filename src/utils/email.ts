import nodemailer from "nodemailer";
import { SendEmailCallback } from "../types/email";

const sendEmail = (
  email: string,
  subject: string,
  content: string,
  callback: SendEmailCallback
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: process.env.OAUTH_ACCESS_TOKEN
    }
  } as nodemailer.TransportOptions);

  transporter.sendMail(
    {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject,
      html: content,
    },
    callback
  );
};

export default sendEmail;
