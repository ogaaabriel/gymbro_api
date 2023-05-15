import { NextFunction, Request, Response } from "express";

import {
  CreateEventValidate,
  UpdateEventDateValidate,
  UpdateEventInfoValidate,
} from "./event.models";
import {
  createEvent as createEventService,
  updateEventInfo as updateEventInfoService,
  updateEventDate as updateEventDateService,
  deleteEvent as deleteEventService,
  findPublicEvents,
  findPrivateEvents,
  findEventById,
  findEventAdmin,
  findEventParticipants,
  checkIsParticipant,
  findUserEvents,
  findAdminEvents,
  leaveEventService,
} from "./event.services";
import { User } from "../types/user";
import { StatusCodes } from "http-status-codes";
import { joinEventService } from "./event.services";
import { parse } from "path";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
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
    const newEvent = await createEventService(newEventData);
    return res.json(newEvent);
  } catch (error) {
    next(error);
  }
};

export const updateEventInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  /*  
    #swagger.parameters['createEvent'] = {
      in: 'body',
      schema: { $ref: '#/definitions/updateEventInfo' }
    } 
  */
  try {
    const newEventInfo = req.body;
    UpdateEventInfoValidate.parse(newEventInfo);
    const event = await updateEventInfoService(req.event?.id!, newEventInfo);
    return res.json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEventDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  /*  
    #swagger.parameters['createEvent'] = {
      in: 'body',
      schema: { $ref: '#/definitions/updateEventDate' }
    } 
  */
  try {
    const newEventDate = req.body;
    UpdateEventDateValidate.parse(newEventDate);
    const event = await updateEventDateService(req.event?.id!, newEventDate);
    return res.json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    await deleteEventService(req.event?.id!);
    return res.json({ message: "Evento excluído com sucesso" });
  } catch (error) {
    next(error);
  }
};

export const getPublicEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
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
  // #swagger.tags = ['Event']
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

export const getUserEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const events = await findUserEvents(req.user?.id!);
    return res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getAdminEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const events = await findAdminEvents(req.user?.id!);
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
  // #swagger.tags = ['Event']
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
    if (!event?.isPublic && !isAdmin && !isParticipant) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Evento não encontrado" });
    }

    const participantsCount = (await findEventParticipants(event?.id!)).length;

    if (event?.hasLimit && event.limitCount) {
      let eventParticipantsCount = 0;
      return res.json({
        event,
        isAdmin,
        isParticipant,
        participantsCount,
        availableCount: event?.limitCount! - participantsCount,
      });
    }

    return res.json({
      event,
      isAdmin,
      isParticipant,
      participantsCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const { eventId } = req.params;
    const participants = await findEventParticipants(parseInt(eventId));
    const participantsWithoutPassword: User[] = [];
    for (let participant of participants) {
      const { password, ...data } = participant;
      participantsWithoutPassword.push(data);
    }
    const admin = await findEventAdmin(parseInt(eventId));
    const { password, ...adminWithoutPassword } = admin!;
    return res.json({
      participants: participantsWithoutPassword,
      admin: adminWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const joinEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const { eventId } = req.params;
    const event = await findEventById(parseInt(eventId));

    // Need to implement friends before user can join private events
    if (!event?.isPublic) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Evento não encontrado" });
    }

    const isAdmin = event?.adminId === req.user?.id;
    const isParticipant = (await checkIsParticipant(event?.id!, req.user?.id!))
      ? true
      : false;

    if (isAdmin || isParticipant) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Você já é um participante deste evento" });
    }

    const eventParticipantsCount = (
      await findEventParticipants(parseInt(eventId))
    ).length;
    if (
      event.hasLimit &&
      event.limitCount &&
      eventParticipantsCount >= event.limitCount
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Este evento já atingiu o limite de usuários" });
    }

    await joinEventService(parseInt(eventId), req.user?.id!);
    return res.json({ message: "Agora você é um participante deste evento" });
  } catch (error) {
    next(error);
  }
};

export const leaveEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['Event']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  try {
    const { eventId } = req.params;
    const event = await findEventById(parseInt(eventId));

    // Need to implement friends before user can join private events
    if (!event?.isPublic) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Evento não encontrado" });
    }

    const isAdmin = event?.adminId === req.user?.id;
    const isParticipant = (await checkIsParticipant(event?.id!, req.user?.id!))
      ? true
      : false;

    if (isAdmin || !isParticipant) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Sem permissão para realizar essa ação" });
    }

    await leaveEventService(parseInt(eventId), req.user?.id!);
    return res.json({
      message: "Você não é mais um participante deste evento",
    });
  } catch (error) {
    next(error);
  }
};
