import jwt from "jsonwebtoken";

import { User } from "../types/user";

export const generateAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, {
    expiresIn: process.env.ACCESS_TOKEN_TIME,
  });
};

export const generateRefreshToken = (user: User, jti: string) => {
  return jwt.sign({ userId: user.id, jti }, process.env.SECRET_KEY!, {
    expiresIn: process.env.REFRESH_TOKEN_TIME,
  });
};

export const generateResetPasswordToken = (user: User, jti: string) => {
  return jwt.sign({ userId: user.id, jti }, process.env.SECRET_KEY!, {
    expiresIn: process.env.RESETPASSWORD_TOKEN_TIME,
    algorithm: "HS256",
  });
};

export const generateConfirmEmailToken = (user: User, jti: string) => {
  return jwt.sign({ userId: user.id, jti }, process.env.SECRET_KEY!, {
    expiresIn: process.env.CONFIRMEMAIL_TOKEN_TIME,
    algorithm: "HS256",
  });
};

export const generateTokens = (user: User, jti: string) => {
  const acessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);
  return [acessToken, refreshToken];
};
