import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-serif font-semibold">Paperas</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Paperas is an
              peer-reviewed academic journal dedicated to publishing quality
              research across various disciplines.
            </p>
            <p className="text-sm text-muted-foreground">
              ISSN: RVJ-2026-0001
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wide uppercase text-muted-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about/aim-scope" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Aim & Scope
                </Link>
              </li>
              <li>
                <Link href="/about/editorial-board" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link href="/about/author-guidelines" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Author Guidelines
                </Link>
              </li>
              <li>
                <Link href="/about/publication-ethics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Publication Ethics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wide uppercase text-muted-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>editor@paperas.dev</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Paperas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
