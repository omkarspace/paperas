"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Menu, X, User } from "lucide-react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { NotificationBell } from "@/components/shared/notification-bell"
import { cn } from "@/lib/utils/utils"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Journal", href: "/journal" },
  { name: "Research", href: "/research" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6">
      <nav className="mx-auto max-w-7xl flex items-center justify-between h-14 px-4 rounded-full border border-border bg-card/80 backdrop-blur-md shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-base font-serif font-semibold">Paperas</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) ? "page" : undefined}
              className={cn(
                "px-3 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full transition-colors",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
          {session ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Profile">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full text-xs" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="h-8 px-3 rounded-full text-xs">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="h-8 px-3 rounded-full text-xs">Register</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-lg p-3 animate-in slide-in-from-top-2 duration-200 [[data-reduced-motion=reduce]:animate-none]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) ? "page" : undefined}
              className={cn(
                "block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t mt-2 pt-2">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="block px-4 py-2.5 text-sm font-medium text-left w-full rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => { setIsOpen(false); signOut(); }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
