export interface Event {
  id: number;
  title: string;
  description: string;
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
  public?: boolean;
  hasLimit?: boolean;
  limitCount?: number | null;
  geocode?: number[];
  address?: string;
}

export interface UpdateEventDate {
  eventDate: string;
}
