import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./auth/auth.routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get("/api/v1/hello", (req: Request, res: Response) =>
  res.json({ message: "Hello, World!" })
);

app.use("/api/v1/auth", authRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));
