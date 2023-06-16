import express from "express";

import {
  confirmEmail,
  forgotPassword,
  login,
  refreshToken,
  resetPassword,
  revokeRefreshTokens,
  signup,
} from "./auth.controllers";
import { isAdmin, isAuthenticated } from "./auth.middlewares";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/confirm_email/:confirmEmailToken", confirmEmail);
authRouter.post("/forgot_password", forgotPassword);
authRouter.post("/reset_password/:resetPasswordToken", resetPassword);
authRouter.post("/refresh_token", refreshToken);
authRouter.post(
  "/revoke_refresh_tokens",
  isAuthenticated,
  isAdmin,
  revokeRefreshTokens
);

export default authRouter;
