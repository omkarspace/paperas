import { db } from "./db";
import { NotificationType } from "@prisma/client";

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  return db.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
    },
  });
}

export async function notifyPaperSubmitted(authorId: string, paperId: string, title: string) {
  return createNotification({
    userId: authorId,
    type: "SUBMISSION_RECEIVED",
    title: "Paper Submitted",
    message: `Your paper "${title}" has been submitted successfully.`,
    link: `/papers/${paperId}`,
  });
}

export async function notifyReviewCompleted(authorId: string, paperId: string, title: string) {
  return createNotification({
    userId: authorId,
    type: "REVIEW_COMPLETED",
    title: "Review Completed",
    message: `A review has been completed for "${title}".`,
    link: `/papers/${paperId}`,
  });
}

export async function notifyRevisionRequested(authorId: string, paperId: string, title: string) {
  return createNotification({
    userId: authorId,
    type: "REVISION_REQUESTED",
    title: "Revision Requested",
    message: `Revisions have been requested for "${title}".`,
    link: `/papers/${paperId}/revisions`,
  });
}

export async function notifyPaperAccepted(authorId: string, paperId: string, title: string) {
  return createNotification({
    userId: authorId,
    type: "PAPER_ACCEPTED",
    title: "Paper Accepted",
    message: `Your paper "${title}" has been accepted for publication!`,
    link: `/papers/${paperId}`,
  });
}

export async function notifyPaperPublished(authorId: string, paperId: string, title: string) {
  return createNotification({
    userId: authorId,
    type: "PAPER_PUBLISHED",
    title: "Paper Published",
    message: `Your paper "${title}" has been published!`,
    link: `/research/${paperId}`,
  });
}