export interface AppNotification {
  id: number;
  message: string;
  projectId: number | null;
  read: boolean;
  createdAt: string;
}