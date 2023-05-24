import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const paginationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let page: any = req.query.page;
    let numItems: any = req.query.numItems;

    if (!page) page = 1;
    if (!numItems) numItems = 10;

    //@ts-ignore
    page = parseInt(page);
    //@ts-ignore
    numItems = parseInt(numItems);

    const paginationValidate = z.object({
      page: z.number().positive(),
      numItems: z.number().positive(),
    });

    const result = paginationValidate.parse({ page, numItems });
    req.page = result.page;
    req.numItems = result.numItems;
    next();
  } catch (error) {
    next(error);
  }
};
