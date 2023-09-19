import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";

import { StatusCodes } from "http-status-codes";
import { isAuthenticated } from "./auth/auth.middlewares";
import authRouter from "./auth/auth.routes";
import userRouter from "./user/user.routes";
import eventsRouter from "./event/event.routes";
import eventTypesRouter from "./eventType/eventType.routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", isAuthenticated, userRouter);
app.use("/api/v1/events", isAuthenticated, eventsRouter);
app.use("/api/v1/event_types", isAuthenticated, eventTypesRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(StatusCodes.BAD_REQUEST).json(error);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
