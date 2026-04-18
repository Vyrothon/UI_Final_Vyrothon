"use client"
import Testimonials from "@/components/testimonials"
import UseCases from "@/components/use-cases"
import MainNavbar from "@/components/main-navbar"
import Footer from "@/components/footer"
import TypingPromptInput from "@/components/typing-prompt-input"
import FeaturesSection from "@/components/features-section"
import StructuredData from "@/components/structured-data"
import SectionTransition from "@/components/section-transition"
import StickyProductShowcase from "@/components/sticky-product-showcase"
import CrmShowcaseSection from "@/components/crm-showcase-section"
import IntegrationsGridSimple from "@/components/integrations-grid-simple"
import NewsletterCTA from "@/components/newsletter-cta"
import { Card } from "@/components/ui/card"
import BookDemoModal from "@/components/book-demo-modal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"

const homeFaqData = [
  {
    question: "How does medical bill OCR and overcharge detection work?",
    answer: (
      <p>
        You upload a photo or PDF, or paste text from a bill. We use OCR and document intelligence to extract line
        items, procedure codes, adjustments, and balances, then review them in real time for patterns that often signal
        duplicate charges, inconsistent coding, or fees that look out of line with typical expectations. You get a clear
        read on what looks reasonable versus what is worth verifying with billing or your insurer. Output is
        informational—not a guarantee or a formal audit.
      </p>
    ),
  },
  {
    question: "Will you add legal rules and consumer protection references?",
    answer: (
      <p>
        Yes—that is on the roadmap. We plan to pair your charges with plain-language pointers to billing transparency
        and patient-rights frameworks (federal and state, where relevant) so you understand context before you call or
        write a dispute. That material is educational only; it is not legal advice and does not replace a licensed
        attorney or a professional patient advocate.
      </p>
    ),
  },
  {
    question: "Is this medical or legal advice?",
    answer: (
      <p>
        No. Nothing here is a diagnosis, treatment recommendation, or legal opinion. The product helps you organize and
        interpret billing paperwork and spot issues to discuss with your provider, insurer, or a qualified professional.
        Always confirm coverage, coding, and balances with your plan and the facility.
      </p>
    ),
  },
  {
    question: "What should I upload—a hospital bill, an EOB, or both?",
    answer: (
      <p>
        Start with the statement that lists what you are being asked to pay. An explanation of benefits (EOB) from your
        insurer is very helpful too: comparing billed amounts, allowed amounts, and patient responsibility often catches
        mismatches. If you only have one document today, upload it; you can add the other later for a fuller picture.
      </p>
    ),
  },
  {
    question: "How accurate is OCR on phone photos of paper bills?",
    answer: (
      <p>
        Sharp, well-lit photos usually work well. Avoid glare, blur, and cut-off edges. PDFs straight from the portal
        often yield the cleanest text. If something looks wrong in the extracted table, you can correct or paste key
        lines so the analysis matches what you see on the original.
      </p>
    ),
  },
  {
    question: "How do you handle my privacy and health-related information?",
    answer: (
      <p>
        We treat uploads and derived data as sensitive. Industry-standard safeguards apply to storage and transmission.
        Review our Privacy Policy for retention, access, and your choices (including deletion requests where offered).
        Minimize what you share if you are uncomfortable—redact account numbers if your workflow allows.
      </p>
    ),
  },
  {
    question: "Can you tell me the exact fair price for every line item?",
    answer: (
      <p>
        Not with certainty. Cash and negotiated rates vary by facility, plan, and region. We focus on structuring your
        bill, highlighting unusual or repetitive charges, and suggesting questions—not on certifying a single “correct”
        price for every service.
      </p>
    ),
  },
  {
    question: "What happens after I get a ‘worth questioning’ flag?",
    answer: (
      <p>
        Use the summary to contact hospital or physician billing, or your insurer’s member services. Ask for an
        itemized bill, coding clarification, or a formal review. We can help you draft talking points or letters;
        success still depends on the provider, plan rules, and timing. Keep copies of everything you send.
      </p>
    ),
  },
  {
    question: "Do you work with my insurance portal or email?",
    answer: (
      <p>
        Integrations are expanding. The core flow is upload-and-analyze in the app; connecting email or storage can speed
        up pulling PDFs you already received. Check the Integrations page for what is live in your region and plan tier.
      </p>
    ),
  },
  {
    question: "What are pricing and contracts like?",
    answer: (
      <p>
        Plans are built for individuals and families who review bills occasionally, and for heavier use if you manage
        care for multiple people. We favor straightforward subscriptions without long lock-ins where possible—see
        Pricing for current tiers and trial options.
      </p>
    ),
  },
  {
    question: "How do I get started?",
    answer: (
      <p>
        Create an account, upload your first bill or EOB, and read the real-time summary. Save or export the notes you
        need for calls. If you get stuck, support can walk you through capture tips and how to interpret the output.
      </p>
    ),
  },
  {
    question: "Who is this for?",
    answer: (
      <p>
        Anyone who opens a medical bill and wonders if it is right—after an ER visit, surgery, imaging, or a stack of
        specialist statements. It is also useful for caregivers coordinating bills for parents or children, as long as
        you have permission to handle that paperwork.
      </p>
    ),
  },
]

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="flex min-h-screen flex-col bg-white">
        <MainNavbar />

        {/* Hero Section with Futuristic Background */}
        <section
          id="hero"
          className="relative min-h-[700px] md:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-25 border-b border-gray-100"
          style={{
            background: `
linear-gradient(to bottom, white 0%, rgba(249, 250, 251, 0.8) 20%, rgb(249, 250, 251) 80%, white 100%),
radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0),
linear-gradient(45deg, rgba(0,0,0,0.003) 25%, transparent 25%),
linear-gradient(-45deg, rgba(0,0,0,0.003) 25%, transparent 25%)
`,
            backgroundSize: "100% 100%, 20px 20px, 40px 40px, 40px 40px",
          }}
        >
          {/* Background image using direct blob URL */}
          <div className="absolute bottom-0 left-0 right-0 w-full flex justify-center items-end z-0">
            <Image
              src="/Lindy AI agents for insurance and smal businesses and sales teams (1).svg"
              alt="AI-assisted review of medical bills and billing documents"
              width={1920} // Intrinsic width for aspect ratio
              height={700} // Intrinsic height for aspect ratio (adjust if known)
              className="w-full max-w-none md:max-w-7xl h-auto opacity-90 md:opacity-90 scale-110 md:scale-100"
              priority // For LCP image
              unoptimized
            />
          </div>

          <div className="container px-4 md:px-6 py-8 max-w-[960px] mx-auto relative z-10 flex flex-col items-center justify-center h-full mt-[-40px] mb-[-60px] md:mb-0">
            <SectionTransition
              className="flex flex-col items-center text-center max-w-3xl mx-auto"
              blurBackground={true}
              suggestedQuestions={[
                {
                  question: "I have a medical bill—am I being overcharged?",
                  explanation:
                    "Upload or paste your bill after OCR. The assistant extracts line items, totals, and codes, then compares what you see to typical patterns so you get a real-time sense of whether charges look fair or worth questioning.",
                },
                {
                  question: "Run OCR on this hospital bill and explain each charge",
                  explanation:
                    "Document intelligence pulls text from scans or PDFs, structures charges and adjustments, and walks through patient vs. insurance responsibility so nothing is buried in fine print.",
                },
                {
                  question: "Flag duplicate or suspicious charges on my statement",
                  explanation:
                    "The agent looks for repeated CPT or facility lines, balance billing red flags, and mismatches between what was billed and what your plan should cover—so you know what to dispute or verify.",
                },
                {
                  question: "What laws or rights might apply to this bill?",
                  explanation:
                    "We're building references to consumer protection and billing transparency rules (e.g. No Surprises Act context where relevant) so you can see plain-language pointers—not legal advice, but a starting map for conversations with billing or your insurer.",
                },
              ]}
            >
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
                Medical bills, decoded—
                <br className="hidden md:block" /> OCR, real-time fairness checks, and next-step context
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Snap or upload a bill. We read it with OCR, tell you if charges look in line or potentially inflated, and layer in consumer-protection context so you are not guessing alone.
              </p>

              <TypingPromptInput />
            </SectionTransition>
          </div>
        </section>

        {/* Gradient overlay section for smooth transition */}
        <section className="relative -mt-16 h-32 bg-gradient-to-b from-white/0 via-white/50 to-white pointer-events-none z-20"></section>

        {/* My Lindy AI Agent Section */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-6 max-w-[960px] mx-auto">
            <SectionTransition className="flex flex-col items-center justify-center mb-16">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                  From scan to clarity in real time
                  <br className="hidden md:block" /> OCR, checks, and the story behind each line
                </h2>
              </div>
            </SectionTransition>

            <div className="mt-8 md:mt-12 w-full max-w-[1200px] mx-auto">
              <Card className="p-6 bg-white border border-gray-100 shadow-sm overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lindy%20ai%20agents%20for%20small%20businesses%2C%20sales%20and%20insurance-U0yP2S7ilkI4q6CyXwY4lZslO8kdHu.svg"
                  alt="Workflow: scan a medical bill, extract charges, review in real time"
                  width={1200} // Example intrinsic width
                  height={800} // Example intrinsic height
                  className="w-full h-auto object-contain rounded-md"
                  unoptimized
                />
              </Card>
            </div>

            {/* Replaced the entire div with the new image */}
            <div className="flex justify-center w-full mt-8">
              <Image
                src="/My lindy ai features for crm dallas texas united states (1).svg"
                alt="Features for OCR, charge breakdown, and billing clarity"
                width={1000} // Example intrinsic width
                height={600} // Example intrinsic height
                className="w-full h-auto object-contain rounded-lg max-w-4xl"
                unoptimized
              />
            </div>
          </div>
        </section>

        {/* CRM Showcase Section */}
        <CrmShowcaseSection />

        {/* Product Showcase with Sticky Layout */}
        <StickyProductShowcase />

        {/* CRM Integration Header */}
        <section className="pt-16 pb-8 bg-white">
          <div className="container px-4 md:px-6 max-w-[960px]">
            <SectionTransition className="flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Integrations</div>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                  Bring bills in from the tools
                  <br className="hidden md:block" /> you already use
                </h2>
              </div>
            </SectionTransition>
          </div>
        </section>

        {/* Integrations Grid */}
        <IntegrationsGridSimple />

        {/* Modified Features Section (now shows 3 cards) */}
        <FeaturesSection />

        {/* New FAQ Section */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="pt-8 max-w-3xl mx-auto border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-10 text-center text-gray-900 dark:text-white">
                FAQ
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {homeFaqData.map((item, index) => (
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

        {/* Use Cases */}
        <UseCases />

        {/* Testimonials */}
        <Testimonials />

        <NewsletterCTA />

        <BookDemoModal />
        <Footer />
      </div>
      <style jsx global>{`
.reset-prose-styles h4,
.reset-prose-styles p,
.reset-prose-styles ul,
.reset-prose-styles li {
color: inherit !important;
}
`}</style>
    </>
  )
}
