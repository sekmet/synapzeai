import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const ACCESS_TOKEN = 'ff3a33a442aa0a1b84e815254ee429f2df53ac0f2f0b924410d84497cec51af9'

interface LinkedAccount {
  address: string
  type: string
  verifiedAt: string | Date
  firstVerifiedAt: string | Date
  latestVerifiedAt: string | Date
}

interface EmailInfo {
  address: string
}

interface OnboardingUser {
  currentStep: number
  completed?: boolean
}

export interface AuthUser {
  id: string
  createdAt: string | Date
  linkedAccounts: LinkedAccount[]
  email: EmailInfo
  delegatedWallets?: any[]
  mfaMethods: any[]
  hasAcceptedTerms: boolean
  isGuest: boolean
  apiKey: string
}

interface AuthState {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    getUser: () => AuthUser | null
    apiKey: string | null
    getApiKey: () => string | null
    setApiKey: (apiKey: string) => void
    resetApiKey: () => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    onboarding: OnboardingUser
    setOnboarding: (onboarding: OnboardingUser) => void
    getOnboarding: () => OnboardingUser
}

export const useAuthStore = create<AuthState>()(
  persist(
  (set, get) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  const onboarding = Cookies.get('synapze:onboarding') !== 'false'
  return {
      user: null,
      onboarding: {
        currentStep: 1,
        completed: onboarding ? false : true
      },
      setUser: (user) =>
        set((state) => ({ ...state, user })),
      getUser: () => get().user,
      apiKey: null,
      getApiKey: () => get().apiKey,
      setApiKey: (apiKey: string) =>
        set((state) => ({ ...state, apiKey })),
      resetApiKey: () =>
        set((state) => ({ ...state, apiKey: null })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, accessToken }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, accessToken: '' }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state, user: null, accessToken: '',
          }
        }),
      getOnboarding: () => get().onboarding,
      setOnboarding: (onboarding) =>
        set((state) => ({
          ...state, onboarding,
        }))
  }
},
{
  name: 'synapze:auth-user',
}
))
