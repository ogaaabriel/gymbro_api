import nodemailer from "nodemailer";
import { google } from "googleapis";
import { SendEmailCallback } from "../types/email";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err)
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      accessToken,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  } as nodemailer.TransportOptions);

  return transporter;
};

const sendEmail = async (
  email: string,
  subject: string,
  content: string,
  callback: SendEmailCallback
) => {
  try {
    const transporter = await createTransporter();

    transporter.sendMail(
      {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject,
        html: content,
      },
      callback
    );
  } catch (e) {
    console.log(e)
  }
};

export default sendEmail;
