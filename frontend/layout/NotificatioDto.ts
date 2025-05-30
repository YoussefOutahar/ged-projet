export interface NotificationDTO {
    id: number;
    summary: string;
    detail: string;
    severity: string;
    dismissed: boolean;
    read: boolean;
    sender: number;
    createdAt: string;
  }