import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwtLib from "jsonwebtoken";

import { findUserById } from "../user/user.services";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Sem autorização para acessar essa rota" });
  }

  try {
    const token = authorizationHeader.split(" ")[1];
    const payload: any = jwtLib.verify(token, process.env.ACCESS_TOKEN_KEY!);

    const user = await findUserById(payload.userId);
    if (!user || !user.isActive) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Autorização inválida" });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Sem permissão para acessar essa rota" });
  }
  next();
};
