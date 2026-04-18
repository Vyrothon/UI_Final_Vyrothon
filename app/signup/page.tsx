"use client"

import dynamic from "next/dynamic"

const SignupForm = dynamic(() => import("@/components/auth/signup-form"), {
  ssr: false,
  loading: () => (
    <div className="container max-w-md px-4 py-24 mx-auto flex justify-center text-muted-foreground text-sm">
      Loading…
    </div>
  ),
})

export default function SignupPage() {
  return <SignupForm />
}
