import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import FloatingBookDemo from "@/components/floating-book-demo"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vyro | Medical bill OCR, real-time charge checks, and billing clarity",
  description:
    "Upload or scan hospital bills and EOBs with OCR. Get structured line items, real-time overcharge-style checks, plain-language explanations, and dispute-ready notes—with consumer-protection context on the roadmap.",
  keywords:
    "medical bill OCR, hospital bill review, medical billing help, EOB explanation, surprise billing, duplicate medical charges, patient billing rights, medical bill dispute, healthcare transparency, Vyro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mylindy.com",
    title: "Vyro — Understand your medical bill before you pay",
    description:
      "OCR for medical bills and insurance statements, real-time flags on suspicious or duplicate charges, and clear next steps for billing calls. Not medical or legal advice.",
    siteName: "Vyro",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lindy%20AI%20Open%20Graph%20image%20by%20Strawberry%20antler-mG8Z9bDi0O9HeOiOcFZH5zx56jFOKH.png",
        width: 1200,
        height: 630,
        alt: "Vyro — AI-assisted medical bill review and billing clarity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyro | Medical bill OCR and real-time fairness checks",
    description:
      "Decode hospital bills and EOBs: OCR, charge checks, plain-language summaries, and help preparing billing questions. Educational only—not medical or legal advice.",
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
