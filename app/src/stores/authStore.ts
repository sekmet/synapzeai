import Cookies from 'js-cookie'
import { create } from 'zustand'

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

export interface AuthUser {
  id: string
  createdAt: string | Date
  linkedAccounts: LinkedAccount[]
  email: EmailInfo
  delegatedWallets?: any[]
  mfaMethods: any[]
  hasAcceptedTerms: boolean
  isGuest: boolean
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
