import { NotificationType } from "@prisma/client";

export type { NotificationType };

export interface JournalIssue {
  id: string;
  volume: number;
  issue: number;
  publicationDate: Date;
  isPublished: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
}
