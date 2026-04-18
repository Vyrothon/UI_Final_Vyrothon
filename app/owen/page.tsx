"use client"

import SectionTransition from "@/components/section-transition"
import MainNavbar from "@/components/main-navbar"
import Footer from "@/components/footer"
import StructuredData from "@/components/structured-data"
import Image from "next/image"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqData = [
  {
    question: "What is Portal assist?",
    answer: (
      <>
        <p className="mb-4">
          Many hospitals and insurers still hide itemized bills behind clunky portals. Portal assist (optional add-on)
          uses vision-capable automation to help you download the right PDFs and receipts so ClearClaim can audit them.
        </p>
        <p>You always approve each step—nothing is sent to billing without your explicit confirmation.</p>
      </>
    ),
  },
  {
    question: "Why not just upload a photo?",
    answer: (
      <p>
        Photos work great for paper statements. Portal assist is for when the only “official” record lives behind a
        login, or when you need multi-page itemizations that are painful to screenshot by hand.
      </p>
    ),
  },
  {
    question: "Is this legal?",
    answer: (
      <p>
        You should only automate portals you are authorized to use, under the hospital or insurer’s terms. ClearClaim
        does not bypass MFA you are not allowed to circumvent and does not store credentials without your consent.
      </p>
    ),
  },
  {
    question: "Which plans include Portal assist?",
    answer: (
      <p>
        Availability rolls out with{" "}
        <Link href="/pricing" className="text-primary hover:underline">
          Pro and enterprise
        </Link>{" "}
        tiers where automation SLAs matter. Contact us if you need a BAA or custom deployment.
      </p>
    ),
  },
]

export default function OwenPage() {
  return (
    <>
      <StructuredData />
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
        <MainNavbar />

        <section className="py-24 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <SectionTransition className="text-center max-w-3xl mx-auto mb-12">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Portal assist</div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-gray-900 dark:text-white">
                <span className="md:block">Pull official PDFs from hospital portals—</span>
                <span className="md:block">without the midnight screenshot marathon.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                Vision-guided workflows complement ClearClaim’s core upload flow. Built for patients who already have
                portal access and just need the documents in one place.
              </p>
              <div className="my-8 flex justify-center">
                <Image
                  src="/owen-ai-vision-agent.svg"
                  alt="Illustration of assisted portal capture for medical bills"
                  width={700}
                  height={700}
                  className="rounded-lg object-contain w-full max-w-2xl"
                />
              </div>
            </SectionTransition>

            <div className="pt-16 mt-16 max-w-3xl mx-auto border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-10 text-center text-gray-900 dark:text-white">
                FAQ
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((item, index) => (
                  <AccordionItem
                    value={`item-${index + 1}`}
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700/60 rounded-xl shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="text-lg font-medium hover:no-underline text-left px-6 py-4 text-gray-900 dark:text-white">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-gray-700 bg-white dark:bg-white px-6 pt-4 pb-5">
                      <div className="prose prose-sm max-w-none dark:prose-invert reset-prose-styles">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <style jsx global>{`
        .reset-prose-styles h4 {
          color: inherit !important;
        }
        .reset-prose-styles p {
          color: inherit !important;
        }
        .reset-prose-styles ul {
          color: inherit !important;
        }
        .reset-prose-styles li {
          color: inherit !important;
        }
      `}</style>
    </>
  )
}
