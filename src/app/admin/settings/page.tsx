"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      journalName: formData.get("name"),
      issn: formData.get("issn"),
      doiPrefix: formData.get("doiPrefix"),
      email: formData.get("email"),
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage({ type: "success", text: "Settings saved successfully" });
    } catch {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Journal Information</CardTitle>
              <CardDescription>Update your journal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Journal Name</Label>
                <Input id="name" name="name" defaultValue="Paperas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issn">ISSN</Label>
                <Input id="issn" name="issn" defaultValue="PAP-2026-0001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doiPrefix">DOI Prefix</Label>
                <Input id="doiPrefix" name="doiPrefix" defaultValue={process.env.NEXT_PUBLIC_DOI_PREFIX || "xxxx"} placeholder="e.g., 1234" />
                <p className="text-xs text-muted-foreground">Your Crossref DOI prefix (without '10.')</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Editor Email</Label>
                <Input id="email" name="email" type="email" defaultValue="editor@paperas.dev" />
              </div>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
              {message && (
                <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                  {message.text}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </form>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage paper categories</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Category management coming soon.</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
