"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || "Subscribed successfully!");
      setEmail("");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Stay Updated
          </h2>
          <p className="mt-4 text-muted-foreground">
            Receive the latest publications and academic insights.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button
              type="submit"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? "..." : "Subscribe"}
            </Button>
          </form>
          {message && (
            <p className="mt-3 text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
