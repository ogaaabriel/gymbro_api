import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface SendEmailCallback {
  (error: Error | null, info: unknown): any;
}
