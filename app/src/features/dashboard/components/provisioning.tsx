import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useAgentDeployStore } from '@/stores/agentDeployStore'

export function ProvisioningSteps() {  
  const { setProvisioning, getProvisioning } = useAgentDeployStore((state) => state)
  const currentStep = getProvisioning().currentStep
  const setCurrentStep = (step: number) => setProvisioning({ ...getProvisioning(), currentStep: step })
  //const completed = getProvisioning().completed ?? false

  const steps = [
    {
      number: 1,
      title: "Building the environment",
      description: "Setting up the base infrastructure components.",
      color: "from-red-500 to-red-600",
    },
    {
      number: 2,
      title: "Deploying agent",
      description: "Creating and configuring the agent.",
      color: "from-orange-500 to-orange-600",
    },
    {
      number: 3,
      title: "Applying environment settings",
      description: "Configuring environment variables and parameters.",
      color: "from-amber-500 to-amber-600",
    },
    {
      number: 4,
      title: "Configuring the agent server",
      description: "Setting up agent server specifications and requirements.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      number: 5,
      title: "Updating agent settings",
      description: "Applying final agent configurations and optimizations.",
      color: "from-lime-500 to-lime-600",
    },
    {
      number: 6,
      title: "Creating secure access endpoint",
      description: "Establishing secure connection points and protocols.",
      color: "from-green-500 to-green-600",
    },
    {
      number: 7,
      title: "Deployment complete",
      description: "Agent is configured and ready to use.",
      color: "from-emerald-500 to-emerald-600",
    },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 shadow-lg">
      <div className="space-y-1 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Agent Provisioning</h1>
        <p className="text-muted-foreground">Follow the progress of your new agent setup.</p>
      </div>
      <div className="relative space-y-4 mb-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <div key={step.number} className="flex items-start gap-4 transition-all duration-300">
              {/* Vertical line connecting steps */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-4 ml-[-1px] w-0.5 h-[calc(100%-64px)] top-8 
                    ${isCompleted ? "bg-gradient-to-b " + step.color : "bg-muted"}`}
                  style={{ transform: "translateX(-50%)" }}
                />
              )}

              {/* Step indicator */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                  ${
                    isCompleted
                      ? `bg-gradient-to-br ${step.color} shadow-lg`
                      : isCurrent
                        ? `bg-gradient-to-br ${step.color} shadow-lg`
                        : "bg-muted"
                  }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white" />
                ) : isCurrent ? (
                    index < steps.length - 1 ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">{step.number}</span>
                )}
              </div>

              {/* Step content */}
              <div className="grid gap-1.5 pb-4">
                <h3
                  className={`text-sm font-medium leading-none ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between">
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
        <Button onClick={handleNextStep} disabled={currentStep === steps.length - 1}>
          {currentStep === steps.length - 1 ? "Completed" : "Next Step"}
        </Button>
      </div>
    </Card>
  )
}

