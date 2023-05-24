import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getAdminEvents,
  getEvent,
  getEventParticipants,
  getPrivateEvents,
  getPublicEvents,
  getUserEvents,
  joinEvent,
  leaveEvent,
  updateEventDate,
  updateEventInfo,
} from "./event.controllers";
import { eventExists, isEventOwner } from "./event.middlewares";
import { paginationMiddleware } from "../middlewares";

const eventsRouter = Router();

eventsRouter.route("/public_events").get(getPublicEvents);
eventsRouter.route("/user_events").get(paginationMiddleware, getUserEvents);
eventsRouter.route("/admin_events").get(paginationMiddleware, getAdminEvents);
// eventsRouter.route("/private_events").get(getPrivateEvents);
eventsRouter.route("/").post(createEvent);
eventsRouter
  .route("/:eventId")
  .get(eventExists, getEvent)
  .patch(eventExists, isEventOwner, updateEventInfo)
  .delete(eventExists, isEventOwner, deleteEvent);
eventsRouter
  .route("/:eventId/update_date")
  .put(eventExists, isEventOwner, updateEventDate);
eventsRouter.route("/:eventId/users").get(eventExists, getEventParticipants);
eventsRouter.route("/join_event/:eventId").post(joinEvent);
eventsRouter.route("/leave_event/:eventId").post(leaveEvent);

export default eventsRouter;
