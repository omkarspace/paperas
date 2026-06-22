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
    from: process.env.EMAIL_FROM || "Paperas <noreply@paperas.dev>",
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
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  })
}

export async function sendNotificationEmail(email: string, title: string, message: string, link?: string) {
  await sendEmail({
    to: email,
    subject: title,
    html: `
      <h1>${title}</h1>
      <p>${message}</p>
      ${link ? `<p><a href="${link}">View details</a></p>` : ""}
    `,
  })
}
