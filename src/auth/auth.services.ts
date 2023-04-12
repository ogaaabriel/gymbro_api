import { TokenType } from "@prisma/client";
import db from "../utils/db";
import { hashToken } from "../utils/hash";

export const addTokenToWhiteList = (
  jti: string,
  token: string,
  tokenType: TokenType,
  userId: number
) => {
  return db.token.create({
    data: {
      id: jti,
      hashedToken: hashToken(token),
      tokenType,
      userId,
    },
  });
};

export const findTokenById = (id: string, tokenType: TokenType) => {
  return db.token.findFirst({ where: { id, tokenType } });
};

export const deleteToken = (id: string) => {
  return db.token.update({
    where: { id },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = (userId: number) => {
  return db.token.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};
