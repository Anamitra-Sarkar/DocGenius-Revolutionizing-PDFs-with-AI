import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthForm } from "@/components/auth/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - DocGenius",
  description: "Create your free DocGenius account",
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthForm type="signup" />
    </AuthLayout>
  )
}
