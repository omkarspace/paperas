import { db } from "@/lib/db"
import { NotificationType } from "@prisma/client"
import { sendNotificationEmail, sendSubmissionConfirmation, sendReviewAssignedEmail, sendDecisionEmail } from "@/lib/services/email"
import { logger } from "@/lib/logger"

interface CreateNotificationParams {
  userId: string
  title: string
  message: string
  type?: NotificationType
  link?: string
  sendEmail?: boolean
}

/**
 * Create an in-app notification and optionally send an email.
 */
export async function createNotification({
  userId,
  title,
  message,
  type = NotificationType.SUBMISSION_RECEIVED,
  link,
  sendEmail: shouldEmail = true,
}: CreateNotificationParams) {
  const notification = await db.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  })

  if (shouldEmail) {
    const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } })
    if (user?.email) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      const fullLink = link ? `${baseUrl}${link}` : undefined
      await sendNotificationEmail(user.email, title, message, fullLink).catch((error) => {
        logger.error("[notifications] Failed to send notification email", { error: error instanceof Error ? error.message : String(error), userId })
      })
    }
  }

  return notification
}

/**
 * Notify when a paper is submitted.
 */
export async function notifyPaperSubmitted(paperId: string, authorId: string, paperTitle: string) {
  // Notify the author
  const author = await db.user.findUnique({ where: { id: authorId }, select: { email: true } })
  if (author?.email) {
    await sendSubmissionConfirmation(author.email, paperTitle, paperId).catch((error) => {
      logger.error("[notifications] Failed to send submission confirmation", { error: error instanceof Error ? error.message : String(error), paperId })
    })
  }

  // Notify all admins/editors
  const admins = await db.user.findMany({
    where: { role: { in: ["ADMIN", "EDITOR"] } },
    select: { id: true, email: true },
  })

  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      title: "New Paper Submitted",
      message: `"${paperTitle}" has been submitted and awaits editorial review.`,
      type: NotificationType.SUBMISSION_RECEIVED,
      link: `/admin/submissions`,
      sendEmail: false,
    })
  }
}

/**
 * Notify when a reviewer is assigned to a paper.
 */
export async function notifyReviewerAssigned(
  reviewerId: string,
  paperId: string,
  paperTitle: string
) {
  const reviewer = await db.user.findUnique({
    where: { id: reviewerId },
    select: { name: true, email: true },
  })

  if (!reviewer) return

  await createNotification({
    userId: reviewerId,
    title: "New Review Assignment",
    message: `You have been assigned to review "${paperTitle}".`,
    type: NotificationType.REVIEWER_ASSIGNED,
    link: `/reviewer`,
    sendEmail: false,
  })

  if (reviewer.email) {
    await sendReviewAssignedEmail(reviewer.email, reviewer.name || "Reviewer", paperTitle, paperId).catch((error) => {
      logger.error("[notifications] Failed to send review assigned email", { error: error instanceof Error ? error.message : String(error), paperId, reviewerId })
    })
  }
}

/**
 * Notify when an editorial decision is made on a paper.
 */
export async function notifyDecisionMade(
  authorId: string,
  paperTitle: string,
  decision: "ACCEPTED" | "REJECTED" | "REVISION_REQUESTED",
  comments?: string
) {
  const typeMap: Record<string, NotificationType> = {
    ACCEPTED: NotificationType.PAPER_ACCEPTED,
    REJECTED: NotificationType.PAPER_REJECTED,
    REVISION_REQUESTED: NotificationType.REVISION_REQUESTED,
  }

  const decisionMessages: Record<string, string> = {
    ACCEPTED: `"${paperTitle}" has been accepted for publication.`,
    REJECTED: `"${paperTitle}" was not accepted for publication.`,
    REVISION_REQUESTED: `"${paperTitle}" requires revisions before a final decision.`,
  }

  await createNotification({
    userId: authorId,
    title: `Paper ${decision.replace("_", " ").toLowerCase()}`,
    message: decisionMessages[decision],
    type: typeMap[decision],
    link: `/dashboard/submissions`,
    sendEmail: false,
  })

  const author = await db.user.findUnique({ where: { id: authorId }, select: { email: true, name: true } })
  if (author?.email) {
    await sendDecisionEmail(author.email, author.name || "Author", paperTitle, decision, comments).catch((error) => {
      logger.error("[notifications] Failed to send decision email", { error: error instanceof Error ? error.message : String(error), paperTitle, decision })
    })
  }
}

/**
 * Notify when a paper is published.
 */
export async function notifyPaperPublished(paperId: string): Promise<void> {
  const paper = await db.paper.findUnique({
    where: { id: paperId },
    select: { title: true, authorId: true, author: { select: { email: true, name: true } } },
  });
  if (!paper) return;

  await createNotification({
    userId: paper.authorId,
    type: NotificationType.PAPER_PUBLISHED,
    title: "Paper Published!",
    message: `Your paper "${paper.title}" has been published.`,
    link: `/papers/${paperId}`,
    sendEmail: true,
  });
}

/**
 * Notify when a review is submitted (for editors/admins).
 */
export async function notifyReviewSubmitted(
  paperId: string,
  paperTitle: string,
  reviewerName: string
) {
  const admins = await db.user.findMany({
    where: { role: { in: ["ADMIN", "EDITOR"] } },
    select: { id: true },
  })

  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      title: "Review Submitted",
      message: `${reviewerName} submitted a review for "${paperTitle}".`,
      type: NotificationType.REVIEW_COMPLETED,
      link: `/admin/submissions`,
      sendEmail: false,
    })
  }
}
