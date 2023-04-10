import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

export const hashToken = (token: string) => {
  return crypto.createHash("sha512").update(token).digest("hex");
};
