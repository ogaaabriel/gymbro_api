import bcrypt from "bcrypt";
import crypto from "crypto";

const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

const hashToken = (token: string) => {
  return crypto.createHash("sha512").update(token).digest("hex");
};

export { hashPassword, hashToken };
