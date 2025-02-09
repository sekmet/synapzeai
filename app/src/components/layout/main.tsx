import React from 'react'
import { cn } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '@privy-io/react-auth';

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, ...props }: MainProps) => {
  const navigate = useNavigate()
  const { login } = useLogin({

    onComplete: ({user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount}) => {
      if (wasAlreadyAuthenticated) {
          // In this case, the user was already `authenticated` when this component was mounted.
          //
          // For already-`authenticated` users, we redirect them to their profile page.
          console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount);
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
              login();
              /*await fetch('/signin', {
                  method: 'POST',
                  body: JSON.stringify(user)
              });*/
          } else {
              // If the user is returning, fetch their data from your backend
              console.log("RETURNING USER", user)
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
