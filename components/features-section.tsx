"use client"

import StaggeredSectionTransition from "./staggered-section-transition"
import FeatureFlipCard from "./feature-flip-card"
import SectionTransition from "./section-transition" // This is for the section title
import Link from "next/link"

const existingFeatures = [
  {
    title: "Case memory",
    description:
      "The assistant remembers prior uploads and conversations so follow-up bills and EOBs are interpreted in context—not as one-off pages.",
    benefit:
      "Fewer repeated explanations, clearer comparisons across visits, and a running picture of what you have already disputed or confirmed.",
  },
  {
    title: "You confirm sensitive steps",
    description:
      "Before anything is sent or shared externally, you review drafts—especially dispute letters, emails, or summaries you might forward.",
    benefit:
      "You stay in control of wording and timing, which matters when dealing with billing offices and insurers.",
  },
  {
    title: "Connect your stack",
    description:
      "Pull PDFs from email and cloud storage where supported, so bills land in one workflow instead of scattered attachments.",
    benefit:
      "Less manual downloading and re-uploading; more time on the actual review.",
  },
]

const newHomePageFeatures = [
  {
    title: "Plain-language breakdowns",
    description:
      "Procedure codes, facility fees, and adjustment rows translated into short explanations you can use on the phone or in a message.",
    benefit: (
      <>
        Stop guessing what a line meant—get a readable narrative tied to your document.
        <br />
        <Link href="/demo" className="text-primary hover:underline font-medium mt-2 inline-block">
          Watch the demo
        </Link>
      </>
    ),
  },
  {
    title: "Dispute-ready notes",
    description:
      "Checklists and suggested questions tailored to the flags we found, so you do not start the call from a blank page.",
    benefit: (
      <>
        Turn “something looks wrong” into specific asks for itemization, coding review, or plan reconsideration.
        <br />
        <Link href="/custom" className="text-primary hover:underline font-medium mt-2 inline-block">
          Custom workflows
        </Link>
      </>
    ),
  },
  {
    title: "Roadmap: rights and rules",
    description:
      "We are layering in references to billing transparency and patient protections where they apply, beside your charges.",
    benefit: (
      <>
        Educational context only—not legal advice—but enough to know which topics to research or raise.
        <br />
        <Link href="/about" className="text-primary hover:underline font-medium mt-2 inline-block">
          About the product
        </Link>
      </>
    ),
  },
]

export default function FeaturesSection() {
  const allFeatures = [...existingFeatures, ...newHomePageFeatures]

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <SectionTransition className="mb-12 md:mb-16 text-center">
          <div className="text-sm text-gray-500 mb-2">Built for real bills</div>
          <h2 className="font-medium tracking-tight text-gray-900 dark:text-white text-4xl md:text-5xl">
            Features that carry you from scan to confidence
          </h2>
        </SectionTransition>

        <StaggeredSectionTransition className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {allFeatures.map((feature, index) => (
            <FeatureFlipCard
              key={index}
              title={feature.title}
              description={feature.description}
              benefit={feature.benefit}
            />
          ))}
        </StaggeredSectionTransition>
      </div>
    </section>
  )
}
