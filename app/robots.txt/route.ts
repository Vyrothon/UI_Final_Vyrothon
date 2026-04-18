import { SITE_URL } from "@/lib/site-config"

// This route handler generates the robots.txt file on demand.

import { withSiteUrl } from "@/lib/site-urls"

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${withSiteUrl("/sitemap.xml")}
`

  // Return the robots.txt as a plain text response
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
