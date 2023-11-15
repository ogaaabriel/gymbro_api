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
  findTokenByContent,
  revokeTokens,
} from "./auth.services";
import {
  changePassword,
  checkUserPassword,
  createUser,
  findUserByEmail,
  findUserById,
  markEmailConfirmed,
} from "../user/user.services";
import { hashToken } from "../utils/hash";
import sendEmail from "../utils/email";
import { generateAccessToken, generateRefreshToken, generateResetPasswordToken } from "../utils/jwt";
import { TokenType } from "@prisma/client";
import { requestEmailConfirmation } from "./utils";
import moment from "moment";

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

    if (!user.isEmailConfirmed) {
      await requestEmailConfirmation(user);
      return res.status(StatusCodes.PRECONDITION_REQUIRED).json({
        message: "Código de confirmação enviado para o email cadastrado!",
      });
    }


    const acessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await addTokenToWhiteList(refreshToken);

    const { password, ...userWithoutPassword } = user;
    return res.json({ acessToken, "refreshToken": refreshToken.token, user: userWithoutPassword });
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
    const newUserData = SignupValidate.parse(req.body);

    const user = await findUserByEmail(newUserData.email);
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Esse email já está sendo utilizado" });
    }

    const newUser = await createUser(newUserData);
    await requestEmailConfirmation(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return res.json({
      user: userWithoutPassword,
      message: "Código de confirmação enviado para o email cadastrado!",
    });
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Auth']
  try {
    const { confirmEmailToken } = req.params;

    if (!confirmEmailToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token é necessário" });
    }

    const savedConfirmEmailToken = await findTokenByContent(
      confirmEmailToken, TokenType.CONFIRM_EMAIL
    );

    if (!savedConfirmEmailToken || moment(savedConfirmEmailToken.expirationTime).isBefore(new Date())) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token inválido" });
    }

    const user = await findUserById(savedConfirmEmailToken.userId);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Autorização inválida" });
    }

    await markEmailConfirmed(user.id);
    await deleteToken(savedConfirmEmailToken.id);

    return res.json({ message: "Email confirmado com sucesso!" });
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

    const token = generateResetPasswordToken(user);
    await addTokenToWhiteList(token);

    sendEmail(
      email,
      "Recuperação de senha",
      `<h2>Seu token para recuperação de senha é: <span style="color: #0d6efd;">${token}</span></h2>`,
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

    const savedResetPasswordToken = await findTokenByContent(
      resetPasswordToken,
      TokenType.RESET_PASSWORD
    );
    if (!savedResetPasswordToken || moment(savedResetPasswordToken.expirationTime).isBefore(new Date())) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token inválido" });
    }

    const user = await findUserById(savedResetPasswordToken.userId);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Autorização inválida" });
    }

    const { newPassword } = req.body;
    passwordValidate(newPassword);

    await deleteToken(savedResetPasswordToken.id);
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

    const savedRefreshToken = await findTokenByContent(
      refreshToken,
      TokenType.REFRESH
    );
    if (!savedRefreshToken || moment(savedRefreshToken.expirationTime).isBefore(new Date())) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token inválido" });
    }

    const user = await findUserById(savedRefreshToken.userId);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Autorização inválida" });
    }

    await deleteToken(savedRefreshToken.id);

    const acessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await addTokenToWhiteList(newRefreshToken);

    return res.json({ acessToken, "newRefreshToken": newRefreshToken.token });
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
