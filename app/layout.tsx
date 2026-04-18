import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import FloatingBookDemo from "@/components/floating-book-demo"
import { SITE_NAME_FULL } from "@/lib/site-config"
import { SITE_URL } from "@/lib/site-urls"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: `${SITE_NAME_FULL} | Hospital bill audits, disputes, and fair pricing clarity`,
  description:
    "ClearClaim AI scans hospital bills and EOBs, flags overcharges and billing fraud patterns, estimates fair totals, generates dispute documents, and connects you to vetted counsel. Not medical or legal advice.",
  keywords:
    "ClearClaim, medical bill OCR, hospital bill audit, billing fraud, EOB review, dispute letter, medical overcharge, patient billing rights, healthcare transparency, US medical billing, surprise billing, Good Faith Estimate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Vyro — Understand your medical bill before you pay",
    description:
      "AI-assisted billing audit: OCR, CPT/ICD cross-checks where data exists, dispute-ready letters, and lawyer marketplace. Educational tool—not a law firm.",
    siteName: SITE_NAME_FULL,
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lindy%20AI%20Open%20Graph%20image%20by%20Strawberry%20antler-mG8Z9bDi0O9HeOiOcFZH5zx56jFOKH.png",
        width: 1200,
        height: 630,
        alt: "ClearClaim AI — hospital bill review and dispute support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME_FULL} | Medical billing audits & disputes`,
    description:
      "Decode hospital bills fast: structured line items, fraud-pattern flags, savings estimates, dispute PDFs, and attorney intake. Not medical or legal advice.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lindy%20AI%20Open%20Graph%20image%20by%20Strawberry%20antler-mG8Z9bDi0O9HeOiOcFZH5zx56jFOKH.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.png" }],
    apple: [{ url: "/favicon.png" }],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6LT083R3P3"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6LT083R3P3');
        `,
          }}
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Calendly badge widget CSS */}
      </head>
      <body className={`${outfit.variable} ${outfit.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <FloatingBookDemo />
        </ThemeProvider>

        {/* Calendly inline widget script */}
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
