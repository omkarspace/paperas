import { ReviewRecommendation } from "@prisma/client";
import { User } from "./user";

export type { ReviewRecommendation };

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
