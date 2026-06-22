import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">Paperas</span>
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
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about/aim-scope" className="text-muted-foreground hover:text-foreground">
                  Aim & Scope
                </Link>
              </li>
              <li>
                <Link href="/about/editorial-board" className="text-muted-foreground hover:text-foreground">
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link href="/about/author-guidelines" className="text-muted-foreground hover:text-foreground">
                  Author Guidelines
                </Link>
              </li>
              <li>
                <Link href="/about/publication-ethics" className="text-muted-foreground hover:text-foreground">
                  Publication Ethics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
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

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Paperas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}