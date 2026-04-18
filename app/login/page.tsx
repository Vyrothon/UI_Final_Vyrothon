"use client"

import dynamic from "next/dynamic"

const LoginForm = dynamic(() => import("@/components/auth/login-form"), {
  ssr: false,
  loading: () => (
    <div className="container max-w-md px-4 py-24 mx-auto flex justify-center text-muted-foreground text-sm">
      Loading…
    </div>
  ),
})

export default function LoginPage() {
  return <LoginForm />
}
