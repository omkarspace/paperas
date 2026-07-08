"use client"

import { Button } from "@/components/ui/button"
import { Share2, Twitter, Linkedin, Mail, Link2 } from "lucide-react"
import { useState } from "react"

interface SocialShareButtonsProps {
  title: string
  url: string
}

export function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: Mail,
    },
  ]

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        Share
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
        >
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <link.icon className="h-4 w-4" />
          </Button>
        </a>
      ))}
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyLink} aria-label="Copy link">
        {copied ? <span className="text-xs font-medium">OK</span> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
