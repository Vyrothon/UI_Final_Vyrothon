import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCodeErrorPage() {
  return (
    <div className="container max-w-md px-4 py-16 md:py-24 mx-auto w-full">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-medium tracking-tight">Link expired or invalid</CardTitle>
          <CardDescription>
            The sign-in link may have expired or was already used. Request a new one from the login or signup page.
          </CardDescription>
        </CardHeader>
        <CardContent />
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/login">Back to log in</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signup">Create account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
