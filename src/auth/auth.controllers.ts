import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwtLib from "jsonwebtoken";
import { v4 } from "uuid";

import {
  LoginValidate,
  SignupValidate,
  emailValidate,
  passwordValidate,
} from "./auth.models";
import {
  addTokenToWhiteList,
  deleteToken,
  findTokenById,
  revokeTokens,
} from "./auth.services";
import {
  changePassword,
  checkUserPassword,
  createUser,
  findUserByEmail,
  findUserById,
} from "../user/user.services";
import { hashToken } from "../utils/hash";
import sendEmail from "../utils/email";
import { generateResetPasswordToken, generateTokens } from "../utils/jwt";
import { TokenType } from "@prisma/client";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Auth']
  /*  
    #swagger.parameters['login'] = {
      in: 'body',
      schema: { $ref: '#/definitions/userCredentials' }
    } 
  */
  try {
    const credentials = LoginValidate.parse(req.body);

    const user = await findUserByEmail(credentials.email);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Credenciais inválidas!" });
    }

    const validPassword = await checkUserPassword(
      credentials.password,
      user.password
    );
    if (!validPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Credenciais inválidas!" });
    }

    const jti = v4();
    const [acessToken, refreshToken] = generateTokens(user, jti);
    await addTokenToWhiteList(jti, refreshToken, TokenType.REFRESH, user.id);

    const { password, ...userWithoutPassword } = user;
    return res.json({ acessToken, refreshToken, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Auth']
  /*  
    #swagger.parameters['signup'] = {
      in: 'body',
      schema: { $ref: '#/definitions/userData' }
    } 
  */
  try {
    let newUser = SignupValidate.parse(req.body);

    const user = await findUserByEmail(newUser.email);
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Esse email já está sendo utilizado" });
    }

    newUser = await createUser(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Auth']
  /*  
    #swagger.parameters['forgotPassword'] = {
      in: 'body',
      schema: { $ref: '#/definitions/forgotPassword' }
    } 
  */
  try {
    const { email } = req.body;
    emailValidate(email);

    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Esse email não corresponde a nenhuma conta" });
    }

    const jti = v4();
    const token = generateResetPasswordToken(user, jti);
    await addTokenToWhiteList(jti, token, TokenType.RESET_PASSWORD, user.id);

    sendEmail(
      email,
      "Recuperação de senha",
      process.env.CLIENT_URL + "/reset_password?token=" + token,
      (error, info) => {
        if (error) {
          throw error;
        }
      }
    );

    return res.json({
      message: "Email para recuperação de senha enviado para " + email,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Auth']
  /*  
    #swagger.parameters['resetPassword'] = {
      in: 'body',
      schema: { $ref: '#/definitions/resetPassword' }
    } 
  */
  try {
    const { resetPasswordToken } = req.params;

    if (!resetPasswordToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token é necessário" });
    }

    const payload: any = jwtLib.verify(
      resetPasswordToken,
      process.env.SECRET_KEY!
    );

    const savedResetPasswordToken = await findTokenById(
      payload.jti || "",
      TokenType.RESET_PASSWORD
    );
    if (!savedResetPasswordToken || savedResetPasswordToken.revoked == true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token inválido" });
    }

    const hashedToken = hashToken(resetPasswordToken);
    if (hashedToken !== savedResetPasswordToken.hashedToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token inválido" });
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Autorização inválida" });
    }

    const { newPassword } = req.body;
    passwordValidate(newPassword);

    await deleteToken(payload.jti);
    await changePassword(newPassword, user.id);

    return res.json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Auth']
  /*  
    #swagger.parameters['refreshToken'] = {
      in: 'body',
      schema: { $ref: '#/definitions/refreshToken' }
    } 
  */
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Refresh token é necessário" });
    }

    const payload: any = jwtLib.verify(refreshToken, process.env.SECRET_KEY!);

    const savedRefreshToken = await findTokenById(
      payload.jti || "",
      TokenType.REFRESH
    );
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

    const user = await findUserById(payload.userId);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Autorização inválida" });
    }

    await deleteToken(payload.jti);

    const jti = v4();
    const [acessToken, newRefreshToken] = generateTokens(user, jti);
    await addTokenToWhiteList(jti, newRefreshToken, TokenType.REFRESH, user.id);

    return res.json({ acessToken, newRefreshToken });
  } catch (error) {
    next(error);
  }
};

export const revokeRefreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Auth']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  /*  
    #swagger.parameters['revokeRefreshTokens'] = {
      in: 'body',
      schema: { $ref: '#/definitions/revokeTokens' }
    } 
  */
  try {
    const { userId } = req.body;
    await revokeTokens(parseInt(userId));
    return res.json({ message: "Token revogados com sucesso" });
  } catch (error) {
    next(error);
  }
};
