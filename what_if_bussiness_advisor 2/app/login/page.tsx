"use client"

import { useState, useEffect } from "react"
import { useDashboardStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Phone, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, setAuthenticated } = useDashboardStore()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [timer, setTimer] = useState(0)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Timer for OTP expiry
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const validatePhoneNumber = (phone: string): boolean => {
    // Accept 10 digit numbers, with or without formatting
    const cleanedPhone = phone.replace(/\D/g, "")
    return cleanedPhone.length === 10
  }

  const handleSendOTP = async () => {
    setError("")

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    setLoading(true)

    // Simulate API call to send OTP
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock OTP generation (in production, this would come from backend)
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(mockOtp)
      setStep("otp")
      setTimer(60) // 60 seconds for OTP

      // In production, log would be removed. For demo, we show it briefly
      console.log(`[Demo] OTP sent to ${phoneNumber}: ${mockOtp}`)
    } catch {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setError("")

    if (otp.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    if (timer === 0) {
      setError("OTP has expired. Please request a new one.")
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verify OTP
      if (otp === generatedOtp) {
        setAuthenticated(true, phoneNumber)
        router.push("/")
      } else {
        setError("Invalid OTP. Please try again.")
      }
    } catch {
      setError("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = () => {
    setStep("phone")
    setOtp("")
    setGeneratedOtp("")
    setTimer(0)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Nexus Analytics</CardTitle>
          <CardDescription>Secure login with phone number and OTP</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      setError("")
                    }}
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your 10-digit phone number (e.g., 1234567890)
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button onClick={handleSendOTP} disabled={loading || !phoneNumber} className="w-full" size="lg">
                {loading ? "Sending..." : "Send OTP"}
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                A 6-digit code will be sent to your phone number
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">OTP sent to:</span>
                    <br />
                    <span className="text-muted-foreground">{phoneNumber}</span>
                  </p>
                </div>

                <label className="text-sm font-medium">Enter OTP</label>
                <div className="flex justify-center py-2">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={loading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {timer > 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    OTP expires in: <span className="font-semibold text-primary">{timer}s</span>
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="w-full" size="lg">
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <button
                onClick={handleResendOTP}
                disabled={loading || timer > 30}
                className="w-full text-sm text-primary hover:underline disabled:text-muted-foreground"
              >
                {timer > 30 ? `Resend in ${timer - 30}s` : "Resend OTP"}
              </button>

              <div className="text-center text-xs text-muted-foreground">
                Didn't receive the code? Check your spam folder or request a new one.
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground">
        <p>Demo: For testing, use any 10-digit number. OTP will be generated and shown in console.</p>
      </div>
    </div>
  )
}
