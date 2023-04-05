import db from "../utils/db";
import { hashToken } from "../utils/hash";

const addRefreshTokenToWhiteList = (
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

const addResetpasswordTokenToWhiteList = (
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

const findRefreshTokenById = (id: string) => {
  return db.refreshToken.findUnique({ where: { id } });
};

const findResetPasswordTokenById = (id: string) => {
  return db.resetPasswordToken.findUnique({ where: { id } });
};

const deleteRefreshToken = (id: string) => {
  return db.refreshToken.update({
    where: { id },
    data: {
      revoked: true,
    },
  });
};

const deleteResetPasswordToken = (id: string) => {
  return db.resetPasswordToken.update({
    where: { id },
    data: {
      revoked: true,
    },
  });
};

const revokeTokens = (userId: number) => {
  return db.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};

export {
  addRefreshTokenToWhiteList,
  addResetpasswordTokenToWhiteList,
  findRefreshTokenById,
  findResetPasswordTokenById,
  deleteRefreshToken,
  deleteResetPasswordToken,
  revokeTokens,
};
