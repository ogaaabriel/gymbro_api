export interface Event {
  id: number;
  title: string;
  description: string;
  eventTypeId: number,
  eventDate: Date;
  isPublic: boolean;
  hasLimit: boolean;
  limitCount: number | null;
  geocode: number[];
  address: string;
  adminId: number;
}

export interface UpdateEventInfo {
  title?: string;
  description?: string;
  eventTypeId: number,
  public?: boolean;
  hasLimit?: boolean;
  limitCount?: number | null;
  geocode?: number[];
  address?: string;
}

export interface UpdateEventDate {
  eventDate: string;
}
