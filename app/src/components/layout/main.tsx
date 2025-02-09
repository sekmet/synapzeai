import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import { usePrivy, useLogin } from '@privy-io/react-auth'
import { useQuery } from "@tanstack/react-query";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

const fetchCurrentUser = async (id: string) => {
  const response = await fetch(`/api/db/v1/users/${id}`);
  return response.json();
};

export const Main = ({ fixed, ...props }: MainProps) => {
  const {ready, authenticated } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  //const disableLogin = !ready || (ready && authenticated);
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fetchCurrentUser('did:privy:cm6xfuy4700f5116hioyuda2d'),
  })

  const navigate = useNavigate()
  const { login } = useLogin({

    onComplete: ({user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount}) => {
      if (wasAlreadyAuthenticated) {
          // In this case, the user was already `authenticated` when this component was mounted.
          //
          // For already-`authenticated` users, we redirect them to their profile page.
          console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount);
          console.log(currentUser.farcaster)
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
    if (ready && !authenticated) {
      navigate({ to: '/sign-in-2' })
    }

  }, [ready, authenticated, login]);

  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-16',
        'px-4 py-6',
        fixed && 'fixed-main flex flex-grow flex-col overflow-hidden'
      )}
      {...props}
    />
  )
}

Main.displayName = 'Main'
