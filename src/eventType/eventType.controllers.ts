import { NextFunction, Request, Response } from "express";
import { findEventTypesByTitle } from "./eventType.services";

export const getEventTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #swagger.tags = ['EventType']
  /* 
    #swagger.security = [
      {"apiKeyAuth": []}
    ] 
  */
  /*  
    #swagger.parameters['search'] = {
      in: 'query',
      type: 'string'
    } 
  */
  try {
    const eventTypes = await findEventTypesByTitle(req.search);
    return res.json({ eventTypes });
  } catch (error) {
    next(error);
  }
};