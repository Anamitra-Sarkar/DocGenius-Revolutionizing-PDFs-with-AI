import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthForm } from "@/components/auth/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - DocGenius",
  description: "Sign in to your DocGenius account",
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthForm type="login" />
    </AuthLayout>
  )
}
