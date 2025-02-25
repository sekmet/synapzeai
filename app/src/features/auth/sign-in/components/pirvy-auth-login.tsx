import { HTMLAttributes, useEffect } from 'react'
import { usePrivy, useLogin } from '@privy-io/react-auth'
//import { Link } from '@tanstack/react-router'
import { useAuthStore, AuthUser } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type PrivyAuthFormProps = HTMLAttributes<HTMLDivElement>

export function PrivyAuthLogin({ className, ...props }: PrivyAuthFormProps) {
  const { setUser } = useAuthStore((state) => state)
  const {ready, authenticated } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);
  
  const navigate = useNavigate()
  const { login } = useLogin({

    onComplete: ({user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount}) => {
      if (wasAlreadyAuthenticated) {
          // In this case, the user was already `authenticated` when this component was mounted.
          //
          // For already-`authenticated` users, we redirect them to their profile page.
          console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount);
          console.log(setUser(user as AuthUser)) // authUser being the new format
          navigate({ to: '/' })
      } else {
          // In this case, the user was not already `authenticated` when the component was mounted
          // but successfully complete `login` during this component's lifecycle.
          //
          // For new `login`s, we make an API request to our backend to find or create the user in our
          // own DBs.
          if (isNewUser) {
              // If the user is new, create it in your backend
              console.log("NEW USER", isNewUser)
              navigate({ to: '/sign-in-2' })
              /*await fetch('/signin', {
                  method: 'POST',
                  body: JSON.stringify(user)
              });*/
          } else {
              // If the user is returning, fetch their data from your backend
              console.log("RETURNING USER", user)
              console.log(setUser(user as AuthUser)) // authUser being the new format
              navigate({ to: '/' })
              /*await fetch(`your-find-user-endpoint/${user.id}`, {
                  method: 'GET',
              });*/
          }
      }
  },
    onError: (error) => {
      console.log(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  useEffect(() => {
    if (ready && authenticated) {
      navigate({ to: '/' })
    }
    
  }, [ready, authenticated, login]);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
            <Button className='mt-2' disabled={disableLogin} onClick={login}>
              Sign in to Synapze
            </Button>
    </div>
  )
}
