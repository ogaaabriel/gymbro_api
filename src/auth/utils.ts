import { TokenType, User } from "@prisma/client";
import { generateConfirmEmailToken } from "../utils/jwt";
import { addTokenToWhiteList } from "./auth.services";
import sendEmail from "../utils/email";
import { v4 } from "uuid";

export const requestEmailConfirmation = async (user: User) => {
  const jti = v4();
  const token = generateConfirmEmailToken(user, jti);
  await addTokenToWhiteList(jti, token, TokenType.CONFIRM_EMAIL, user.id);
  sendEmail(
    user.email,
    "Confirmação de email",
    `<h2>Seu token para a confirmação de email é: <span style="color: #0d6efd;">${token}</span></h2>`,
    (error, info) => {
      if (error) {
        throw error;
      }
    }
  );
};
