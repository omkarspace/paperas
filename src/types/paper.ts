import { PaperStatus } from "@prisma/client";
import { User } from "./user";
import { Category } from "./category";

export type { PaperStatus };

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
