import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SITE_NAME, getAppLoginUrl, getAppSignupUrl } from "@/lib/site-config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-8 md:py12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo on the left */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block font-semibold text-lg tracking-tight text-foreground">
              {SITE_NAME}
            </Link>
          </div>

          {/* Navigation links and social icons on the right */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Menu
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-[0.5rem] shadow-none border border-gray-200 dark:border-gray-800"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/pricing">Pricing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/savings">Savings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/integrations/overview">Integrations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/custom">Enterprise</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/forms">Bill intake</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tasks">Dispute tracker</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/poe">Letters &amp; docs</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/owen">Portal assist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/demo">Demo</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getAppLoginUrl()}>Log in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={getAppSignupUrl()}>Sign up</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/privacy">Privacy</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/terms">Terms</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-4">
              <Link
                href="https://www.linkedin.com/company/strawberryantler/"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
                aria-label="LinkedIn"
              >
                <img src="/brand-linkedin-gray.svg" alt="LinkedIn" className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/antlerai"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
                aria-label="X (Twitter)"
              >
                <img src="/brand-x-gray.svg" alt="X" className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@strawberryantler"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
                aria-label="YouTube"
              >
                <img src="/brand-youtube-gray.svg" alt="YouTube" className="h-5 w-5" />
              </Link>
              <Link
                href="https://open.spotify.com/show/0nTqXSnuU74GgJScf3BU9r?si=fWAzwoHNRb612Xc7csmPWA"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
                aria-label="Spotify"
              >
                <img src="/brand-spotify-gray.svg" alt="Spotify" className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
