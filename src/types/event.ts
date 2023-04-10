export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  public: boolean;
  hasLimit: boolean;
  limitCount: number;
  adminId: number;
}
