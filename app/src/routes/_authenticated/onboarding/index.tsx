import { createFileRoute } from '@tanstack/react-router'
import OnBoarding from '@/features/onboarding'

export const Route = createFileRoute('/_authenticated/onboarding/')({
  component: OnBoarding,
})
