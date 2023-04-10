import db from "../utils/db";
import { hashToken } from "../utils/hash";

export const addRefreshTokenToWhiteList = (
  jti: string,
  refreshToken: string,
  userId: number
) => {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

export const addResetpasswordTokenToWhiteList = (
  jti: string,
  resetpasswordToken: string,
  userId: number
) => {
  return db.resetPasswordToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(resetpasswordToken),
      userId,
    },
  });
};

export const findRefreshTokenById = (id: string) => {
  return db.refreshToken.findUnique({ where: { id } });
};

export const findResetPasswordTokenById = (id: string) => {
  return db.resetPasswordToken.findUnique({ where: { id } });
};

export const deleteRefreshToken = (id: string) => {
  return db.refreshToken.update({
    where: { id },
    data: {
      revoked: true,
    },
  });
};

export const deleteResetPasswordToken = (id: string) => {
  return db.resetPasswordToken.update({
    where: { id },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = (userId: number) => {
  return db.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};
