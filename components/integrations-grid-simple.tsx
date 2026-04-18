"use client"

import { motion } from "framer-motion"
import SectionTransition from "@/components/section-transition"
import Image from "next/image"
import Link from "next/link"

export default function IntegrationsGridSimple() {
  return (
    <section className="py-8 bg-white">
      {/* New image added below the main container div */}
      <div className="mt-8 flex justify-center">
        <Image
          src="/My lindy AI Insurance integrations (2).svg"
          alt="Connect email, storage, and insurer portals to pull billing PDFs"
          width={1000}
          height={600}
          className="w-full max-w-4xl h-auto object-contain"
          unoptimized
        />
      </div>
      {/* The original section content, now moved below the image */}
      <div className="container px-4 md:px-6 max-w-[960px] bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-8">
        {" "}
        {/* Added mt-8 for spacing */}
        <SectionTransition className="text-center max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl font-medium mb-4">Pull bills from the apps you already use</h3>
          <p className="text-muted-foreground">
            Email, cloud storage, and insurer or hospital portals are the fastest way to get PDFs into review—without
            retyping line items. We are expanding connectors so fewer documents get stuck in your downloads folder.
          </p>
          <div className="mt-4">
            {" "}
            {/* Added div wrapper and margin-top */}
            <Link href="/integrations/overview" className="text-primary hover:underline">
              See available integrations
            </Link>
          </div>
        </SectionTransition>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto"
        ></motion.div>
      </div>
    </section>
  )
}
