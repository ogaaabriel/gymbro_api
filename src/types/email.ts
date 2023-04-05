import SMTPTransport from "nodemailer/lib/smtp-transport";

interface SendEmailCallback {
  (error: Error | null, info: SMTPTransport.SentMessageInfo): any;
}

export { SendEmailCallback };
