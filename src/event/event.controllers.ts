import { NextFunction, Request, Response } from "express";

import { CreateEventValidate } from "./event.models";
import {
  createEvent as createEventService,
  findPublicEvents,
  findPrivateEvents,
  findEventById,
  findEventAdmin,
  findEventParticipants,
  checkIsParticipant,
} from "./event.services";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  /*  
    #swagger.parameters['createEvent'] = {
      in: 'body',
      schema: { $ref: '#/definitions/eventData' }
    } 
  */
  try {
    let newEventData = req.body;
    newEventData.adminId = req.user?.id;
    newEventData = CreateEventValidate.parse(newEventData);

    await createEventService(newEventData);
    return res.json({ newEvent: newEventData });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
  } catch (error) {
    next(error);
  }
};

export const getPublicEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const events = await findPublicEvents();
    return res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getPrivateEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const events = await findPrivateEvents();
    return res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const { eventId } = req.params;
    const event = await findEventById(parseInt(eventId));
    const isAdmin = event?.adminId === req.user?.id;
    const isParticipant = (await checkIsParticipant(event?.id!, req.user?.id!))
      ? true
      : false;
    return res.json({ event, isAdmin, isParticipant });
  } catch (error) {
    next(error);
  }
};

export const getEventParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const { eventId } = req.params;
    const participants = await findEventParticipants(parseInt(eventId));
    const admin = await findEventAdmin(parseInt(eventId));
    return res.json({ participants, admin });
  } catch (error) {
    next(error);
  }
};

export const joinEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
  } catch (error) {
    next(error);
  }
};

export const leaveEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
  } catch (error) {
    next(error);
  }
};
