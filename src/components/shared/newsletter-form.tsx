"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email…"
          required
          autoComplete="email"
          spellCheck={false}
          className="flex h-12 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-colors"
        />
        <Button type="submit" disabled={status === "loading"} size="sm" className="rounded-full px-5">
          {status === "loading" ? "Loading…" : "Subscribe"}
        </Button>
      </form>
      {status === "success" && (
        <p className="text-sm text-primary mt-2" role="status" aria-live="polite">{message}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive mt-2" role="status" aria-live="polite">{message}</p>
      )}
    </div>
  );
}
