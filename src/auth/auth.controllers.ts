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
  markEmailConfirmed,
} from "../user/user.services";
import { hashToken } from "../utils/hash";
import sendEmail from "../utils/email";
import { generateResetPasswordToken, generateTokens } from "../utils/jwt";
import { TokenType } from "@prisma/client";
import { requestEmailConfirmation } from "./utils";

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

    if (!user.isEmailConfirmed) {
      await requestEmailConfirmation(user);
      return res.status(StatusCodes.PRECONDITION_REQUIRED).json({
        message: "Código de confirmação enviado para o email cadastrado!",
      });
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

    const payload: any = jwtLib.verify(
      confirmEmailToken,
      process.env.SECRET_KEY!
    );

    const savedConfirmEmailToken = await findTokenById(
      payload.jti || "",
      TokenType.CONFIRM_EMAIL
    );
    if (!savedConfirmEmailToken || savedConfirmEmailToken.isRevoked == true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Token inválido" });
    }

    const hashedToken = hashToken(confirmEmailToken);
    if (hashedToken !== savedConfirmEmailToken.hashedToken) {
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

    await markEmailConfirmed(user.id);
    await deleteToken(payload.jti);

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

    const jti = v4();
    const token = generateResetPasswordToken(user, jti);
    await addTokenToWhiteList(jti, token, TokenType.RESET_PASSWORD, user.id);

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

    const payload: any = jwtLib.verify(
      resetPasswordToken,
      process.env.SECRET_KEY!
    );

    const savedResetPasswordToken = await findTokenById(
      payload.jti || "",
      TokenType.RESET_PASSWORD
    );
    if (!savedResetPasswordToken || savedResetPasswordToken.isRevoked == true) {
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
    if (!savedRefreshToken || savedRefreshToken.isRevoked == true) {
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
