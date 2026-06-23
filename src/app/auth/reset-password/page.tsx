"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })

    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push("/auth/login"), 2000)
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border rounded-md shadow-none">
          <CardContent className="pt-6">
            <p className="text-destructive">Invalid reset link.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border rounded-md shadow-none">
          <CardHeader>
            <CardTitle className="font-serif font-bold text-2xl">Password reset</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Password reset successfully. Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border rounded-md shadow-none">
        <CardHeader>
          <CardTitle className="font-serif font-bold text-2xl">Set new password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="password" placeholder="New password" className="h-11 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <Input type="password" placeholder="Confirm password" className="h-11 rounded-md" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">Reset password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
