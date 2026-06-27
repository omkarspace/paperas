"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Stay Updated
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join 5,000+ researchers receiving the latest publications and academic insights.
          </p>
          <form className="mt-8 flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
