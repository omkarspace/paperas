import { UserRole, PaperStatus, ReviewRecommendation, NotificationType } from "@prisma/client";

export type { UserRole, PaperStatus, ReviewRecommendation, NotificationType };

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
  institution: string | null;
}

export interface Paper {
  id: string;
  paperId: string;
  title: string;
  abstract: string;
  keywords: string;
  pdfUrl: string | null;
  supplementaryUrls: string;
  status: PaperStatus;
  submissionDate: Date | null;
  publicationDate: Date | null;
  volume: number | null;
  issue: number | null;
  authorId: string;
  author?: User;
  category?: Category | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  paperId: string;
  reviewerId: string;
  comments: string;
  recommendation: ReviewRecommendation;
  isBlind: boolean;
  rating: number | null;
  createdAt: Date;
  reviewer?: User;
}

export interface Category {
  id: string;
  name: string;
}

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
