"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/journal", label: "Journal" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 transition-all duration-300 ease-out",
        isScrolled
          ? "bg-background/98 backdrop-blur-md shadow-sm h-12"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16"
      )}
    >
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/icon.svg"
              alt="Paperas"
              width={isScrolled ? 28 : 34}
              height={isScrolled ? 28 : 34}
              priority
              className="transition-all duration-300"
            />
          </div>
          <span
            className={cn(
              "font-serif font-bold text-primary transition-all duration-300",
              isScrolled ? "text-base" : "text-xl"
            )}
          >
            Paperas
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md",
                pathname === link.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-4 mt-8">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border" />
              <Button variant="outline" asChild>
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>Login</Link>
              </Button>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>Register</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
