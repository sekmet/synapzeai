import { Check } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from "react"
import { useAuthStore } from '@/stores/authStore'

export function Onboarding() {
  const navigate = useNavigate()
  const { getOnboarding, setOnboarding } = useAuthStore((state) => state)
  const [activeStep, setActiveStep] = useState<number>(getOnboarding().currentStep)

  const verifyEmail = () => {
    console.log("Verify email")
    navigate({ to: '/settings' })
  }

  const setupProfile = () => {
    console.log("Setup profile")
    navigate({ to: '/settings/account' })
  }

  const setupPreferences = () => {
    console.log("Setup preferences")
    navigate({ to: '/settings/appearance' })
  }

  const createAgent = () => {
    console.log("Create agent")
    navigate({ to: '/agent/new' })
  }

  const handleStepClick = (stepNumber: number) => {
    console.log(`Step ${stepNumber} clicked`)
    setOnboarding({ ...getOnboarding(), currentStep: stepNumber })
    setActiveStep(stepNumber)
    if (stepNumber === 2) verifyEmail()
    if (stepNumber === 3) setupProfile()
    if (stepNumber === 4) setupPreferences()
    if (stepNumber === 5) createAgent()
  }


  const steps = [
    {
      number: 1,
      title: "Create an Account",
      description: "Start by creating your account.",
      completed: activeStep >= 1 ? true : false,
      onClick: () => setActiveStep(2)
    },
    {
      number: 2,
      title: "Verify your Email",
      description: "Confirm your email address.",
      completed: activeStep >= 2 ? true : false,
      onClick: () => verifyEmail()
    },
    {
      number: 3,
      title: "Setup your Profile",
      description: "Add personal details to your profile.",
      completed: activeStep >= 3 ? true : false,
      onClick: () => setupProfile()
    },
    {
      number: 4,
      title: "Choose your Preferences",
      description: "Customize your account settings.",
      completed: activeStep >= 4 ? true : false,
      onClick: () => setupPreferences()
    },
    {
      number: 5,
      title: "Create your first agent",
      description: "Begin exploring and enjoying our features.",
      completed: activeStep >= 5 ? true : false,
      onClick: () => createAgent()
    },
  ]

  useEffect(() => {
    setActiveStep(getOnboarding().currentStep)
    console.log(getOnboarding().currentStep)
  }, [activeStep])

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Synapze!</h1>
          <p className="text-lg text-muted-foreground">Follow the steps to complete your setup.</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <Card
            onClick={() => handleStepClick(step.number)}
            key={step.number}
            className={`p-4 transition-colors cursor-pointer ${
              step.completed ? "bg-card hover:bg-accent/10" : "bg-muted/40 dark:bg-muted/10"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  step.completed
                    ? "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground dark:bg-muted/20"
                }`}
              >
                {step.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">{step.title}</h2>
                  {step.completed && <Check className="h-5 w-5 text-green-600" aria-hidden="true" />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}