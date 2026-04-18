import { SITE_URL } from "@/lib/site-config"

// This route handler generates the robots.txt file on demand.

export async function GET() {
  const baseUrl = SITE_URL.replace(/\/$/, "")

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`

  // Return the robots.txt as a plain text response
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
