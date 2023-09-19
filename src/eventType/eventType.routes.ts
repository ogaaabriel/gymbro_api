import { Router } from "express";
import { searchMiddleware } from "../middlewares";
import { getEventTypes } from "./eventType.controllers";

const eventTypesRouter = Router();

eventTypesRouter.route("/event_types").get(searchMiddleware, getEventTypes);

export default eventTypesRouter;