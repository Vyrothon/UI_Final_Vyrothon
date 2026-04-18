"use client"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "I took a photo of my ER bill and finally understood what half the lines meant. It flagged a duplicate facility line—I called billing and they adjusted it.",
      name: "Jordan",
      title: "Parent of two",
    },
    {
      quote:
        "Between the hospital PDF and my insurer’s EOB, I could never tell what I actually owed. The breakdown in plain English saved me hours of phone trees.",
      name: "Alex",
      title: "Self-employed",
    },
    {
      quote:
        "I’m not confrontational by nature. Having a short list of specific questions to ask made the call to billing feel doable instead of overwhelming.",
      name: "Riley",
      title: "Chronic care patient",
    },
    {
      quote:
        "We’re helping my mom after surgery. Uploading her stack of statements in one place beat spreadsheets and sticky notes. The ‘looks suspicious’ hints were spot-on to double-check.",
      name: "Sam",
      title: "Family caregiver",
    },
    {
      quote:
        "I still verify everything with my plan—but I’m not starting from zero anymore. Real-time feedback on the first pass is exactly what I needed.",
      name: "Priya",
      title: "High-deductible plan member",
    },
  ]

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="py-20 bg-white overflow-hidden hidden md:block">
      <div className="max-w-[960px] mx-auto relative">
        {/* Gradient fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Container with hidden overflow */}
        <div className="overflow-hidden">
          {/* Scrolling testimonials */}
          <motion.div
            className="flex gap-6 items-center"
            animate={{
              x: [0, -2000],
            }}
            transition={{
              duration: 40,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ width: "fit-content" }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="min-w-[320px] max-w-[320px] sm:min-w-[400px] sm:max-w-[400px] h-[240px] sm:h-[280px] p-6 sm:p-8 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow flex-shrink-0 flex flex-col"
              >
                <div className="text-center">
                  <blockquote className="text-sm sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 leading-snug sm:leading-relaxed flex-1">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center justify-center mt-auto">
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
