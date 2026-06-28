import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.warn("Email not sent: RESEND_API_KEY not configured", { to, subject })
    return
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Paperas <noreply@paperas.in>",
    to,
    subject,
    html,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

  await sendEmail({
    to: email,
    subject: "Reset your Paperas password",
    html: `
      <div style="font-family: 'Source Sans 3', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e3a5f; font-family: 'Libre Baskerville', serif;">Password Reset</h1>
        <p>We received a request to reset your password for your Paperas account.</p>
        <p>Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #d4a843; color: #1e3a5f; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; margin: 16px 0;">Reset Password</a>
        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Paperas — Advancing Research in India</p>
      </div>
    `,
  })
}

export async function sendSubmissionConfirmation(email: string, paperTitle: string, paperId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  await sendEmail({
    to: email,
    subject: `Paper Submitted: ${paperTitle}`,
    html: `
      <div style="font-family: 'Source Sans 3', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e3a5f; font-family: 'Libre Baskerville', serif;">Submission Received</h1>
        <p>Thank you for submitting your paper to Paperas.</p>
        <div style="background-color: #f8fafc; border-left: 4px solid #d4a843; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; font-weight: 600;">${paperTitle}</p>
          <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Paper ID: ${paperId}</p>
        </div>
        <p>Your paper is now under editorial review. You will receive an email when it moves to the next stage.</p>
        <a href="${baseUrl}/dashboard/submissions" style="display: inline-block; background-color: #1e3a5f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; margin: 16px 0;">View Submissions</a>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Paperas — Advancing Research in India</p>
      </div>
    `,
  })
}

export async function sendReviewAssignedEmail(email: string, reviewerName: string, paperTitle: string, paperId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  await sendEmail({
    to: email,
    subject: `Review Assignment: ${paperTitle}`,
    html: `
      <div style="font-family: 'Source Sans 3', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e3a5f; font-family: 'Libre Baskerville', serif;">Review Assignment</h1>
        <p>Dear ${reviewerName},</p>
        <p>You have been assigned to review a paper for Paperas.</p>
        <div style="background-color: #f8fafc; border-left: 4px solid #1e3a5f; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; font-weight: 600;">${paperTitle}</p>
          <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Paper ID: ${paperId}</p>
        </div>
        <p>Please complete your review within 4 weeks. You can access the paper through your reviewer dashboard.</p>
        <a href="${baseUrl}/reviewer" style="display: inline-block; background-color: #1e3a5f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; margin: 16px 0;">Go to Reviewer Dashboard</a>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Paperas — Advancing Research in India</p>
      </div>
    `,
  })
}

export async function sendDecisionEmail(
  email: string,
  authorName: string,
  paperTitle: string,
  decision: "ACCEPTED" | "REJECTED" | "REVISION_REQUESTED",
  comments?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  
  const decisionText: Record<string, string> = {
    ACCEPTED: "Your paper has been <strong style='color: #16a34a;'>accepted</strong> for publication.",
    REJECTED: "We regret to inform you that your paper has not been accepted for publication.",
    REVISION_REQUESTED: "Your paper requires revisions before a final decision can be made.",
  }

  await sendEmail({
    to: email,
    subject: `Decision: ${paperTitle}`,
    html: `
      <div style="font-family: 'Source Sans 3', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e3a5f; font-family: 'Libre Baskerville', serif;">Editorial Decision</h1>
        <p>Dear ${authorName},</p>
        <p>${decisionText[decision]}</p>
        <div style="background-color: #f8fafc; border-left: 4px solid #d4a843; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; font-weight: 600;">${paperTitle}</p>
        </div>
        ${comments ? `<p><strong>Reviewer Comments:</strong></p><p style="color: #666; white-space: pre-wrap;">${comments}</p>` : ""}
        <a href="${baseUrl}/dashboard/submissions" style="display: inline-block; background-color: #1e3a5f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; margin: 16px 0;">View Submissions</a>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Paperas — Advancing Research in India</p>
      </div>
    `,
  })
}

export async function sendNotificationEmail(email: string, title: string, message: string, link?: string) {
  await sendEmail({
    to: email,
    subject: title,
    html: `
      <div style="font-family: 'Source Sans 3', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e3a5f; font-family: 'Libre Baskerville', serif;">${title}</h1>
        <p>${message}</p>
        ${link ? `<a href="${link}" style="display: inline-block; background-color: #1e3a5f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600; margin: 16px 0;">View Details</a>` : ""}
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Paperas — Advancing Research in India</p>
      </div>
    `,
  })
}
