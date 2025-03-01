import { createLazyFileRoute } from '@tanstack/react-router'
import SignIn2 from '@/features/auth/sign-in/signin'

export const Route = createLazyFileRoute('/(auth)/signin')({
  component: SignIn2,
})
