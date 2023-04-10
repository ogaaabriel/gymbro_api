import db from "../utils/db";

import { Event } from "../types/event";

export const createEvent = (eventData: Event) => {
  return db.event.create({
    data: { ...eventData, eventDate: new Date(eventData.eventDate) },
  });
};

export const findPublicEvents = () => {
  return db.event.findMany({ where: { public: true } });
};

export const findPrivateEvents = () => {
  return db.event.findMany({ where: { public: false } });
};

export const findEventById = (id: number) => {
  return db.event.findUnique({ where: { id } });
};

export const findEventParticipants = (id: number) => {
  return db.user.findMany({
    where: { UsersOnEvents: { some: { eventId: id } } },
  });
};

export const findEventAdmin = (id: number) => {
  return db.user.findFirst({ where: { events: { some: { id } } } });
};

export const checkIsParticipant = (eventId: number, userId: number) => {
  return db.user.findFirst({
    where: { UsersOnEvents: { some: { eventId, userId } } },
  });
};
