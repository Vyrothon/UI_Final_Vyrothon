"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import SectionTransition from "./section-transition"

export default function CrmShowcaseSection() {
  return (
    <section className="py-24 bg-white">
      <div className="px-4 md:px-6 mx-auto max-w-[960px]">
        <SectionTransition className="flex flex-col items-center justify-center mb-12">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Bill intelligence</div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
              Every line item, explained—
              <br className="hidden md:block" /> so you know what to pay and what to question
            </h2>
          </div>
        </SectionTransition>

        {/* First card - CRM showcase */}
        <Image
          src="/AI CRM for insurance and sales teams My Lindy (3).svg"
          alt="Dashboard-style view of structured medical charges and balances"
          width={950}
          height={500}
          unoptimized
          priority
          className="w-full h-auto max-w-[1050px] md:max-w-[950px] mx-auto"
        />

        {/* Second card - The smartest section */}
        <div className="bg-white rounded-2xl px-6 py-10 md:px-10 mt-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl font-semibold mb-4">One place for every statement</h3>
              <p className="text-muted-foreground mb-6">
                OCR turns scans into structured charges; the assistant highlights what looks routine versus what merits a
                second look, and keeps your notes together for follow-up calls or appeals—without a spreadsheet.
              </p>
              <a
                href="/savings"
                className="text-primary flex items-center font-medium hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = "/savings"
                }}
              >
                Estimate time and stress saved <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-2">
                  <h4 className="text-xl font-semibold mb-4">Structured charges</h4>
                </div>
                <p className="text-muted-foreground">
                  Line items, codes, and adjustments are parsed into a table you can read and search—no more squinting at
                  six pages of PDF.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-2">
                  <h4 className="text-xl font-semibold mb-4">Real-time red flags</h4>
                </div>
                <p className="text-muted-foreground">
                  Get immediate cues when something looks duplicated, inconsistent, or unusually high compared with
                  typical patterns—then verify with billing or your plan.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-2">
                  <h4 className="text-xl font-semibold mb-4">Next-step context</h4>
                </div>
                <p className="text-muted-foreground">
                  Short explanations of balances, coding, and timelines—and soon, plain-language consumer-protection
                  references to support your conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
