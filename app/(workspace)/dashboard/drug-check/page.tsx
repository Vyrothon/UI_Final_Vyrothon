import { redirect } from "next/navigation"

export default function DrugCheckRedirectPage() {
  redirect("/dashboard/medicine")
}
