import jwt from "jsonwebtoken";

import { User } from "../types/user";

const generateAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.SECRET_KEY!, {
    expiresIn: process.env.ACCESS_TOKEN_TIME,
  });
};

const generateRefreshToken = (user: User, jti: string) => {
  return jwt.sign({ userId: user.id, jti }, process.env.SECRET_KEY!, {
    expiresIn: process.env.REFRESH_TOKEN_TIME,
  });
};

const generateTokens = (user: User, jti: string) => {
  const acessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);
  return [acessToken, refreshToken];
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
