import { Request, Response, NextFunction } from "express";
import { findEventById } from "./event.services";
import { StatusCodes } from "http-status-codes";

export const eventExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const event = await findEventById(parseInt(eventId));
    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Evento não encontrado" });
    }
    req.event = event;
    next();
  } catch (error) {
    next(error);
  }
};

export const isEventOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.event?.adminId != req.user?.id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Sem permissão para acessar essa rota" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
