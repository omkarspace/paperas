import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
          </Link>
          <CardTitle className="font-serif text-2xl">Create Account</CardTitle>
          <CardDescription>Join the Research Verse academic community</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Dr. Priya Sharma" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@university.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" required />
            </div>
            <div className="space-y-3">
              <Label>Account Type</Label>
              <RadioGroup defaultValue="author" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="author" id="author" />
                  <Label htmlFor="author" className="font-normal">Author</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reviewer" id="reviewer" />
                  <Label htmlFor="reviewer" className="font-normal">Reviewer</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="rounded border-input" required />
              <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </Label>
            </div>
            <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
