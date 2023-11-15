import { TokenType } from "@prisma/client";
import db from "../utils/db";
import { Token } from "../types/token";

export const addTokenToWhiteList = (
  tokenData: Token,
) => {
  return db.token.create({
    data: {
      ...tokenData
    },
  });
};

export const findTokenByContent = (content: string, tokenType: TokenType) => {
  return db.token.findFirst({ where: { token: content, tokenType } });
};

export const deleteToken = (id: number) => {
  return db.token.delete({
    where: { id },
  });
};

export const revokeTokens = (userId: number) => {
  return db.token.deleteMany({
    where: { userId },
  });
};
