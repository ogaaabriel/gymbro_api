import jwt from "jsonwebtoken";

import { User } from "../types/user";
import { v4 } from 'uuid';
import { Token } from "../types/token";
import { TokenType } from "@prisma/client";

export const generateAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, {
    expiresIn: process.env.ACCESS_TOKEN_TIME,
  });
};

export const generateRefreshToken = (user: User): Token => {
  return {
    token: v4(),
    tokenType: TokenType.REFRESH,
    expirationTime: setTokenExpirationDate(parseInt(process.env.REFRESH_TOKEN_TIME!)),
    userId: user.id
  }
};

export const generateResetPasswordToken = (user: User) => {
  return {
    token: v4(),
    tokenType: TokenType.RESET_PASSWORD,
    expirationTime: setTokenExpirationDate(parseInt(process.env.RESETPASSWORD_TOKEN_TIME!)),
    userId: user.id
  }
};

export const generateConfirmEmailToken = (user: User) => {
  return {
    token: v4(),
    tokenType: TokenType.CONFIRM_EMAIL,
    expirationTime: setTokenExpirationDate(parseInt(process.env.CONFIRMEMAIL_TOKEN_TIME!)),
    userId: user.id
  }
};

const setTokenExpirationDate = (expirationTime: number): Date => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + expirationTime)
  return expirationDate;
}