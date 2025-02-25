import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
//import { Separator } from '@/components/ui/separator'
import { useNavigate } from '@tanstack/react-router'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { usePrivy, useLogin } from '@privy-io/react-auth'
import { useQuery } from "@tanstack/react-query";
import { useAuthStore, AuthUser } from '@/stores/authStore'
import { fetchCurrentUser, createUser } from '@/lib/users'
import { useAgentDeployStore } from '@/stores/agentDeployStore'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)
  const { getProvisioning } = useAgentDeployStore((state) => state)
  const { getOnboarding, setOnboarding, setUser, getUser, setApiKey } = useAuthStore((state) => state)
  const onboarding = !getOnboarding().completed
  const isProvisioning = getProvisioning().isProvisioning;

  const {ready, authenticated } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  //const disableLogin = !ready || (ready && authenticated);
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetchCurrentUser(getUser()?.id ?? ''),
  })

  const navigate = useNavigate()
  const { login } = useLogin({

    onComplete: ({user, isNewUser, wasAlreadyAuthenticated}) => {
      if (wasAlreadyAuthenticated) {
          // In this case, the user was already `authenticated` when this component was mounted.
          // For already-`authenticated` users, we redirect them to their profile page.
          if (currentUser?.id === undefined) {
             // If the user is new, create it in your backend
             createUser(user.id, user?.email?.address ?? '', user?.linkedAccounts ?? [], user?.mfaMethods ?? [], user?.hasAcceptedTerms ?? false, user.createdAt)    
          }
          //console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount);
          //console.log({currentUser: currentUser?.id})
          //console.log(setUser(user as AuthUser)) // authUser being the new format
          setUser(user as AuthUser) // authUser being the new format
          //TODO remove hardcoded and get api-key from keystack server
          setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')
          console.log({currentUser})
          setOnboarding({ ...getOnboarding(), completed: currentUser?.onboarding === false ? true : false })

          //navigate({ to: '/' })
      } else {
          // In this case, the user was not already `authenticated` when the component was mounted
          // but successfully complete `login` during this component's lifecycle.
          //
          // For new `login`s, we make an API request to our backend to find or create the user in our
          // own DBs.
          if (isNewUser) {
              // If the user is new, create it in your backend
              console.log("NEW USER", isNewUser)

              createUser(user.id, user?.email?.address ?? '', user?.linkedAccounts ?? [], user?.mfaMethods ?? [], user?.hasAcceptedTerms ?? false, user.createdAt)
              //console.log(setUser(user as AuthUser)) // authUser being the new format
              setUser(user as AuthUser) 
              //TODO remove hardcoded and get api-key from keystack server
              setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')              
              
              navigate({ to: '/' })
          } else {
              // If the user is returning, fetch their data from your backend
              //console.log("RETURNING USER", user)
              if (currentUser?.id === undefined) {
                // If the user is new, create it in your backend
                createUser(user.id, user?.email?.address ?? '', user?.linkedAccounts ?? [], user?.mfaMethods ?? [], user?.hasAcceptedTerms ?? false, user.createdAt)    
             }
              //console.log(setUser(user as AuthUser)) // authUser being the new format
              setUser(user as AuthUser) 
              //TODO remove hardcoded and get api-key from keystack server
              setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')
              setOnboarding({ ...getOnboarding(), completed: currentUser?.onboarding === false ? true : false })
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
      navigate({ to: '/sign-in-2' })
    }

  }, [ready, authenticated, login]);


  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'flex h-16 items-center gap-3 bg-background p-4 sm:gap-4',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      {onboarding || isProvisioning ? null : (<SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />)}
      {/*<Separator orientation='vertical' className='h-6' />*/}
      {children}
    </header>
  )
}

Header.displayName = 'Header'
