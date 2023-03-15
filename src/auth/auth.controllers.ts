import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import * as jwtLib from "jsonwebtoken";
import { v4 } from "uuid";

import { UserLogin } from "../types/user";
import db from "../utils/db";
import { UserLoginValidate, UserSignupValidate } from "./auth.models";
import jwt from "../utils/jwt";
import hashToken from "../utils/hashToken";

const login = async (req: Request, res: Response) => {
  let credentials: UserLogin;

  try {
    credentials = UserLoginValidate.parse(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }

  const user = await db.user.findUnique({
    where: { email: credentials.email },
  });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Credenciais inválidas!" });
  }

  const validPassword = await bcrypt.compare(
    credentials.password,
    user.password
  );
  if (!validPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Credenciais inválidas!" });
  }

  const jti = v4();
  const { acessToken, refreshToken } = jwt.generateTokens(user, jti);

  try {
    await db.refreshToken.create({
      data: { id: jti, hashedToken: hashToken(refreshToken), userId: user.id },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error);
  }

  return res.json({ acessToken, refreshToken });
};

const signup = async (req: Request, res: Response) => {
  let newUser;

  try {
    newUser = UserSignupValidate.parse(req.body);
    await db.user.create({
      data: { ...newUser, password: await bcrypt.hash(newUser.password, 10) },
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }

  return res.json(newUser);
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Refresh token é necessário" });
  }

  let payload: any;

  try {
    payload = jwtLib.verify(refreshToken, "segredo123");
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }

  const savedRefreshToken = await db.refreshToken.findUnique({
    where: { id: payload.jti || "" },
  });
  if (!savedRefreshToken || savedRefreshToken.revoked == true) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Token inválido" });
  }

  const hashedToken = hashToken(refreshToken);
  if (hashedToken !== savedRefreshToken.hashedToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Token inválido" });
  }

  const user = await db.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Autorização inválida" });
  }

  await db.refreshToken.update({
    where: { id: payload.jti },
    data: {
      revoked: true,
    },
  });

  const jti = v4();
  const acessToken = jwt.generateAcessToken(user);
  const newRefreshToken = jwt.generateRefreshToken(user, jti);

  try {
    await db.refreshToken.create({
      data: { hashedToken: hashToken(newRefreshToken), userId: user.id },
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }

  return res.json({ acessToken, refreshToken });
};

export { login, signup, refreshToken };
