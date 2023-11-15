import { TokenType, User } from "@prisma/client";
import { generateConfirmEmailToken } from "../utils/jwt";
import { addTokenToWhiteList, revokeTokens } from "./auth.services";
import sendEmail from "../utils/email";

export const requestEmailConfirmation = async (user: User) => {
  await revokeTokens(user.id);
  const token = generateConfirmEmailToken(user);
  await addTokenToWhiteList(token);
  sendEmail(
    user.email,
    "Confirmação de email",
    `<h2>Seu token para a confirmação de email é: <span style="color: #0d6efd;">${token.token}</span></h2>`,
    (error, info) => {
      if (error) {
        throw error;
      }
    }
  );
};
