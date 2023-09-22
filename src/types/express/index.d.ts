import { Event } from "../event";
import { User } from "../user";

export { };

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      event?: Event;
      page?: number;
      numItems?: number;
      search?: any;
      eventTypeId?: number;
    }
  }
}
