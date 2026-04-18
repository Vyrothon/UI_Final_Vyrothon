export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ClearClaim AI",
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
      "Hospital bill and EOB auditing: OCR, fraud-pattern detection, fair-price estimates, dispute documents, and attorney marketplace. Not medical or legal advice.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "186",
    },
    featureList: [
      "Hospital bill and EOB OCR",
      "Overcharge and billing-fraud pattern detection",
      "Government rate cross-checks where available",
      "Dispute letter and PDF generation",
      "Resolution tracking and success-fee billing",
      "Legal marketplace intake with audit packet",
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
