import { createLazyFileRoute } from '@tanstack/react-router'
import VerifyEmail from '@/features/auth/verify-email'

export const Route = createLazyFileRoute(
  '/(auth)/verify-email/$verificationToken',
)({
  component: VerifyEmail,
})
