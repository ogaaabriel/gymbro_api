import db from "../utils/db";

import { Event, UpdateEventDate, UpdateEventInfo } from "../types/event";

export const createEvent = (eventData: Event) => {
  return db.event.create({
    data: { ...eventData, eventDate: new Date(eventData.eventDate) },
  });
};

export const updateEventInfo = (id: number, data: UpdateEventInfo) => {
  return db.event.update({ where: { id }, data: { ...data } });
};

export const updateEventDate = (id: number, data: UpdateEventDate) => {
  return db.event.update({ where: { id }, data: { ...data } });
};

export const deleteEvent = (id: number) => {
  return db.event.update({ where: { id }, data: { isActive: false } });
};

export const findPublicEvents = (search?: string, eventTypeId?: number) => {
  return db.event.findMany({
    where: {
      isPublic: true,
      isActive: true,
      eventDate: { gte: new Date() },
      eventTypeId: { equals: eventTypeId },
      OR: [
        { title: { contains: search || "", mode: "insensitive" } },
        { description: { contains: search || "", mode: "insensitive" } },
      ],
    },
    include: { eventType: true }
  });
};

export const findPrivateEvents = (search?: string, eventTypeId?: number) => {
  return db.event.findMany({
    where: {
      isPublic: false,
      isActive: true,
      eventDate: { gte: new Date() },
      eventTypeId: { equals: eventTypeId },
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    },
    include: { eventType: true }

  });
};

export const findParticipantEvents = (
  userId: number,
  page: number,
  numItems: number,
  search?: string, eventTypeId?: number
) => {
  return db.event.findMany({
    skip: (page - 1) * numItems,
    take: numItems,
    where: {
      isActive: true,
      eventDate: { gte: new Date() },
      UsersOnEvents: { some: { userId } },
      eventTypeId: { equals: eventTypeId },
      OR: [
        { title: { contains: search || "", mode: "insensitive" } },
        { description: { contains: search || "", mode: "insensitive" } },
      ],
    },
    include: { eventType: true }
  });
};

export const findAdminEvents = (
  userId: number,
  page: number,
  numItems: number,
  search?: string, eventTypeId?: number
) => {
  return db.event.findMany({
    skip: (page - 1) * numItems,
    take: numItems,
    where: {
      isActive: true,
      eventDate: { gte: new Date() },
      adminId: userId,
      eventTypeId: { equals: eventTypeId },
      OR: [
        { title: { contains: search || "", mode: "insensitive" } },
        { description: { contains: search || "", mode: "insensitive" } },
      ],
    },
    include: { eventType: true }
  });
};

export const findUserEvents = (
  userId: number,
  page: number,
  numItems: number,
  search?: string, eventTypeId?: number
) => {
  /*
  * For now the implementation of pagination will be done in the frontend
  return db.event.findMany({
    skip: (page - 1) * numItems,
    take: numItems,
    orderBy: [{ eventDate: "asc" }],
    where: {
      isActive: true,
      eventDate: { gte: new Date() },
      AND: [
        { OR: [{ adminId: userId }, { UsersOnEvents: { some: { userId } } }] },
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    },
  });
  */
  return db.event.findMany({
    orderBy: [{ eventDate: "asc" }],
    where: {
      isActive: true,
      eventDate: { gte: new Date() },
      eventTypeId: { equals: eventTypeId },
      AND: [
        { OR: [{ adminId: userId }, { UsersOnEvents: { some: { userId } } }] },
        {
          OR: [
            { title: { contains: search || "", mode: "insensitive" } },
            { description: { contains: search || "", mode: "insensitive" } },
          ],
        },
      ],
    },
    include: { eventType: true }
  });
};

export const findEventById = (id: number) => {
  return db.event.findFirst({
    where: { id, isActive: true, eventDate: { gte: new Date() } },
    include: { eventType: true }
  });
};

export const findEventParticipants = (id: number) => {
  return db.user.findMany({
    where: { UsersOnEvents: { some: { eventId: id } } },
  });
};

export const findEventAdmin = (id: number) => {
  return db.user.findFirst({
    where: { events: { some: { id } } },
  });
};

export const checkIsParticipant = (eventId: number, userId: number) => {
  return db.user.findFirst({
    where: { UsersOnEvents: { some: { eventId, userId } } },
  });
};

export const joinEventService = (eventId: number, userId: number) => {
  return db.usersOnEvents.create({
    data: { eventId, userId },
  });
};

export const leaveEventService = (eventId: number, userId: number) => {
  return db.usersOnEvents.deleteMany({
    where: { eventId, userId },
  });
};
