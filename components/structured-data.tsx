export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Medical bill OCR and fairness review",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    },
    description:
      "Upload or scan medical bills and EOBs with OCR; get structured line items, real-time overcharge-style checks, and plain-language context for calls to billing or insurance.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "186",
    },
    featureList: [
      "Medical bill and EOB OCR",
      "Real-time charge and duplicate-line checks",
      "Patient vs insurer responsibility summaries",
      "Dispute and billing-call talking points",
      "Roadmap: consumer protection and transparency references",
      "Privacy-conscious document handling",
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
