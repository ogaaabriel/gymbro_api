import express from "express";

import { login, refreshToken, signup } from "./auth.controllers";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/refresh_token", refreshToken);

export default authRouter;
