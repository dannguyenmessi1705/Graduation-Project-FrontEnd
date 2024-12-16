export interface Notification {
  id: number;
  userId: string;
  title: string;
  content: string;
  type: string;
  link: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface NotificationResponse {
  status: {
    apiPath: string;
    statusCode: number;
    message: string;
    timestamp: string;
  };
  data: Notification[];
}
