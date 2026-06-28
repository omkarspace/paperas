import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";

const footerLinks = {
  about: [
    { href: "/about", label: "About Us" },
    { href: "/about#editorial-board", label: "Editorial Board" },
    { href: "/journal", label: "Journal Scope" },
    { href: "/contact", label: "Contact" },
  ],
  authors: [
    { href: "/auth/register", label: "Submit Paper" },
    { href: "/dashboard", label: "Author Dashboard" },
    { href: "/journal#guidelines", label: "Submission Guidelines" },
    { href: "/journal#ethics", label: "Publication Ethics" },
  ],
  reviewers: [
    { href: "/auth/login", label: "Reviewer Login" },
    { href: "/reviewer", label: "Reviewer Dashboard" },
    { href: "/journal#review-process", label: "Review Process" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-secondary" />
              <span className="font-serif text-xl font-bold">Paperas</span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              A peer-reviewed journal committed to open access, rigorous review, and scholarly excellence.
            </p>
            <div className="flex gap-4 text-primary-foreground/70">
              <Mail className="h-4 w-4" />
              <span className="text-sm">editor@paperas.in</span>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Authors */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold">For Authors</h3>
            <ul className="space-y-2">
              {footerLinks.authors.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Reviewers */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold">For Reviewers</h3>
            <ul className="space-y-2">
              {footerLinks.reviewers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} Paperas Journal And Publication House Of India. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-primary-foreground/50">
            <Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
