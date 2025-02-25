import { createContext, useContext, useEffect, useState } from 'react'
import { usePrivy, useLogin } from '@privy-io/react-auth'
import { useQuery } from "@tanstack/react-query";
import { useAuthStore, AuthUser } from '@/stores/authStore'
import { fetchCurrentUser, createUser } from '@/lib/users'

type AuthProviderProps = {
    children: React.ReactNode
    defaultUserId?: string
    storageKey?: string
  }
  
  type AuthProviderState = {
    userId: string
    resetUserId: () => void
  }
  
  const initialState: AuthProviderState = {
    userId: '',
    resetUserId: () => null,
  }

  const AuthProviderContext = createContext<AuthProviderState>(initialState)

  export function AuthProvider({
    children,
    defaultUserId = '',
    storageKey = 'synapze:auth-user',
    ...props
  }: AuthProviderProps) {
    const { getOnboarding, setOnboarding, setUser, getUser, setApiKey } = useAuthStore((state) => state)

    const [userId, _setUserId] = useState<any>(
      () => (getUser()?.id as string) || defaultUserId
    )

    const {ready, authenticated } = usePrivy();
    // Disable login when Privy is not ready or the user is already authenticated
    //const disableLogin = !ready || (ready && authenticated);
    const { data: currentUser } = useQuery({
      queryKey: ['currentUser', getUser()?.id],
      queryFn: () => fetchCurrentUser(getUser()?.id ?? ''),
    })

    const { login } = useLogin({
  
      onComplete: ({user, isNewUser, wasAlreadyAuthenticated}) => {
        if (wasAlreadyAuthenticated) {
            const isUser = currentUser;
            // In this case, the user was already `authenticated` when this component was mounted.
            // For already-`authenticated` users, we redirect them to their profile page.
            if (isUser?.id === undefined && !getUser()?.id) {
               // If the user is new, create it in your backend
               createUser(user.id, user?.email?.address ?? '', user?.linkedAccounts ?? [], user?.mfaMethods ?? [], user?.hasAcceptedTerms ?? false, user.createdAt)    
            }
            //console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount);
            //console.log({currentUser: currentUser?.id})
            //console.log(setUser(user as AuthUser)) // authUser being the new format
            setUser(user as AuthUser) // authUser being the new format
            //TODO remove hardcoded and get api-key from keystack server
            setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')
            //console.log({isUser})
            setOnboarding({ ...getOnboarding(), completed: isUser?.onboarding === false ? true : false })
  
            //navigate({ to: '/' })
        } else {
            // In this case, the user was not already `authenticated` when the component was mounted
            // but successfully complete `login` during this component's lifecycle.
            //
            // For new `login`s, we make an API request to our backend to find or create the user in our
            // own DBs.
            if (isNewUser) {
                // If the user is new, create it in your backend
                //console.log("NEW USER", isNewUser)
                const isUser = currentUser;
  
                createUser(user.id, user?.email?.address ?? '', user?.linkedAccounts ?? [], user?.mfaMethods ?? [], user?.hasAcceptedTerms ?? false, user.createdAt)
                //console.log(setUser(user as AuthUser)) // authUser being the new format
                setUser(user as AuthUser) 
                //TODO remove hardcoded and get api-key from keystack server
                setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')
                setOnboarding({ ...getOnboarding(), completed: isUser?.onboarding === false ? true : false })
                //navigate({ to: '/' })
            } else {
              const isUser = currentUser;
                // If the user is returning, fetch their data from your backend
                //console.log("RETURNING USER", user)
                if (isUser?.id === undefined) {
                  // If the user is new, create it in your backend
                  createUser(user.id, user?.email?.address ?? '', user?.linkedAccounts ?? [], user?.mfaMethods ?? [], user?.hasAcceptedTerms ?? false, user.createdAt)    
               }
                //console.log(setUser(user as AuthUser)) // authUser being the new format
                setUser(user as AuthUser) 
                //TODO remove hardcoded and get api-key from keystack server
                setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')
                setOnboarding({ ...getOnboarding(), completed: isUser?.onboarding === false ? true : false })
            }
        }
    },
      onError: (error) => {
        console.log(error);
        // Any logic you'd like to execute after a user exits the login flow or there is an error
      },
    });
  
    useEffect(() => {
      if (ready && !authenticated) {
        //window.location.href = new URL(window.location.href).origin + '/sign-in-2'
        console.log('not authenticated')
      }
  
    }, [ready, authenticated, login]);    

  
    useEffect(() => {
        console.log('from auth user provide', userId)
    }, [userId])

    const resetUserId = () => {
        localStorage.removeItem(storageKey)
        _setUserId('')
    }

    const value = {
        userId,
        resetUserId,
    }

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  )

}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthUser = () => {
    const context = useContext(AuthProviderContext)
  
    if (context === undefined)
      throw new Error('useTheme must be used within a ThemeProvider')
  
    return context
  }
  