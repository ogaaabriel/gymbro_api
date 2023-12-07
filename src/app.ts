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
import { ZodError } from "zod";

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

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  let message = "";
  if (error instanceof ZodError) {
    message = ""
    error.issues.map(issue => message += issue.message + "\n")
  } else {
    message = error.message
  }
  res.status(StatusCodes.BAD_REQUEST).json({ message });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
