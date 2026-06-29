import { z } from "zod";
import { PaperStatus } from "@prisma/client";

const VALID_TRANSITIONS: Record<PaperStatus, PaperStatus[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["REVISION_REQUESTED", "ACCEPTED", "REJECTED"],
  REVISION_REQUESTED: ["SUBMITTED"],
  ACCEPTED: ["PUBLISHED"],
  PUBLISHED: [],
  REJECTED: [],
};

export function canTransition(from: PaperStatus, to: PaperStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export const updatePaperStatusSchema = z.object({
  status: z.nativeEnum(PaperStatus),
});
