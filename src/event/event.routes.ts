import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEventParticipants,
  getPrivateEvents,
  getPublicEvents,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "./event.controllers";

const eventsRouter = Router();

eventsRouter.route("/public_events").get(getPublicEvents);
eventsRouter.route("/private_events").get(getPrivateEvents);
eventsRouter
  .route("/")
  .post(createEvent)
  .patch(updateEvent)
  .delete(deleteEvent);
eventsRouter.route("/:eventId").get(getEvent);
eventsRouter.route("/:eventId/users").get(getEventParticipants);
eventsRouter.route("/join_event").post(joinEvent);
eventsRouter.route("/leave_event").post(leaveEvent);

export default eventsRouter;
