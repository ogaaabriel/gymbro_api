import { Decimal } from "@prisma/client/runtime";

export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: Date;
  isPublic: boolean;
  hasLimit: boolean;
  limitCount: number | null;
  geocode: Decimal[] | number[];
  adminId: number;
}

export interface UpdateEventInfo {
  title?: string;
  description?: string;
  public?: boolean;
  hasLimit?: boolean;
  limitCount?: number | null;
  geocode?: Decimal[] | number[];
}

export interface UpdateEventDate {
  eventDate: string;
}
