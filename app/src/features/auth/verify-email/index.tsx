import { useEffect, useState } from "react"
import { useParams } from '@tanstack/react-router'
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from '@tanstack/react-router'
import AuthLayout from '../auth-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuthStore } from '@/stores/authStore'

export default function VerifyEmail() {
   const { verificationToken } = useParams({ strict: false })
   const { getUser } = useAuthStore((state) => state)
   const navigate = useNavigate()
  const [token, setToken] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (verificationToken) {
      setToken(verificationToken)
    }
  }, [])

  const handleVerify = async () => {
    if (!verificationToken) {
      setStatus("error")
      setMessage("Please enter a verification token")
      return
    }

    setStatus("loading")
    try {
      // Replace with your actual verification API call
      const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/auth/verify-email`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: getUser()?.id,
          verificationToken: token
        }),
      })

      if (!response.ok) throw new Error("Verification failed")

      setStatus("success")
      setMessage("Email verified successfully!")
      setTimeout(() => {
        navigate({to: '/'})
      }, 2000)
    } catch (error) {
      setStatus("error")
      setMessage("Failed to verify email. Please try again.")
    }
  }

  return (
    <AuthLayout>
    <div className="container max-w-lg mx-auto px-4 py-1">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#0F172A]">Verify your Email</CardTitle>
          <CardDescription>Please confirm your email address to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter verification token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleVerify}
            disabled={status === "loading"}
            className="w-full bg-[#22C55E] hover:bg-[#16A34A]"
          >
            {status === "loading" ? "Verifying..." : "Verify Email"}
          </Button>

          {status === "success" && (
            <div className="flex items-center gap-2 text-[#22C55E]">
              <CheckCircle2 className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}

          <div className="text-sm text-[#64748B] text-center">
            Didn&apos;t receive the token?{" "}
            <Button variant="link" className="text-[#22C55E]">
              Resend
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </AuthLayout>
  )
}

