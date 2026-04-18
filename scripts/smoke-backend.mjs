import fs from "node:fs/promises"

const baseUrl = process.env.CLEARCLAIM_BASE_URL || "http://localhost:3000"

async function readJson(path) {
  const raw = await fs.readFile(path, "utf8")
  return JSON.parse(raw)
}

async function post(path, body) {
  let response
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (response.status !== 404) break
    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  const contentType = response.headers.get("content-type") || ""
  const payload = contentType.includes("application/json") ? await response.json() : await response.text()

  if (!response.ok) {
    throw new Error(`${path} failed (${response.status}): ${typeof payload === "string" ? payload : JSON.stringify(payload)}`)
  }
  return payload
}

async function runFlow(fixturePath) {
  const fixture = await readJson(fixturePath)
  const ingest = await post("/api/ingest", fixture)
  const audit = await post("/api/audit", { bill_id: ingest.bill_id })
  const docs = await post("/api/documents/generate", { bill_id: ingest.bill_id, kind: "auto" })

  return {
    fixture: fixturePath,
    bill_id: ingest.bill_id,
    verdict: audit.result.audit_summary.verdict,
    overcharge_amount: audit.result.audit_summary.overcharge_amount,
    document_type: docs.document_type,
    document_id: docs.document_id,
  }
}

async function main() {
  const clean = await runFlow("fixtures/bills/clean.json")
  const fraud = await runFlow("fixtures/bills/fraud.json")

  console.log("Smoke test completed successfully")
  console.log(JSON.stringify({ clean, fraud }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
