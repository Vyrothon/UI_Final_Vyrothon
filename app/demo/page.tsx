import ClearClaimWorkbench from "@/components/clearclaim-workbench"

export default function DemoPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8">
        <p className="mb-2 text-sm text-gray-500">Interactive Demo</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">ClearClaim End-to-End Workbench</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Run the complete backend flow from the UI: ingest bill JSON, audit for overcharges, and generate the PDF
          document.
        </p>
      </div>
      <ClearClaimWorkbench />
    </main>
  )
}
