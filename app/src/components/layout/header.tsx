import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
//import { Separator } from '@/components/ui/separator'
import { useNavigate } from '@tanstack/react-router'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { usePrivy, useLogin } from '@privy-io/react-auth'
import { useQuery } from "@tanstack/react-query";
import { useAuthStore, AuthUser } from '@/stores/authStore'
import { useAgentDeployStore } from '@/stores/agentDeployStore'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

const fetchCurrentUser = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/users/${id}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};

const createUser = async (id: string, emailAddress: string, linkedAccounts: any[], mfaMethods: any[], hasAcceptedTerms: boolean, createdAt: string | Date) => {
  // Create user
  const userResponse = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, emailAddress, linkedAccounts, mfaMethods, hasAcceptedTerms, createdAt }),
  });
  const createdUser = await userResponse.json();

  // Check if user has an organization
  /*const orgsResponse = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  const organizations = await orgsResponse.json();
  
  const userOrg = organizations?.length > 0 && organizations?.find((org: any) => 
    org.members?.some((member: any) => member.user_id === id)
  );*/
  // Fetch current user's organization
  const orgsResponse = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations/${id}/organization`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  const organization = await orgsResponse.json();
  
  //const userOrg = organizations?.length > 0 && organizations.find((org: any) => 
  //  org.members?.some((member: any) => member.user_id === currentUserId)
  //);

  console.log({OERGANIZATION: organization})

  if (!organization[0]) {
    // Create default organization
    const orgResponse = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Default Organization',
        subscriptionStatus: 'active',
        billingEmail: emailAddress
      }),
    });
    const createdOrg = await orgResponse.json();
    console.log({createdOrg})

    // Add user as organization member
    await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations/${createdOrg[0]}/members`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: id, //createdUser[0],
        role: 'owner'
      }),
    });
  }

  return createdUser;
};


export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)
  const { getProvisioning } = useAgentDeployStore((state) => state)
  const { getOnboarding, setUser, getUser, setApiKey } = useAuthStore((state) => state)
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

    onComplete: ({user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount}) => {
      if (wasAlreadyAuthenticated) {
          // In this case, the user was already `authenticated` when this component was mounted.
          // For already-`authenticated` users, we redirect them to their profile page.
          if (currentUser?.id === undefined) {
             // If the user is new, create it in your backend
             createUser(user.id, user?.email?.address ?? '', user?.linkedAccounts ?? [], user?.mfaMethods ?? [], user?.hasAcceptedTerms ?? false, user.createdAt)    
          }
          console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount);
          console.log({currentUser: currentUser?.id})
          console.log(setUser(user as AuthUser)) // authUser being the new format
          //TODO remove hardcoded and get api-key from keystack server
          setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')

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
              console.log(setUser(user as AuthUser)) // authUser being the new format
              //TODO remove hardcoded and get api-key from keystack server
              setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')              
              
              navigate({ to: '/' })
              /*await fetch('/signin', {
                  method: 'POST',
                  body: JSON.stringify(user)
              });*/
          } else {
              // If the user is returning, fetch their data from your backend
              console.log("RETURNING USER", user)
              if (currentUser?.id === undefined) {
                // If the user is new, create it in your backend
                createUser(user.id, user?.email?.address ?? '', user?.linkedAccounts ?? [], user?.mfaMethods ?? [], user?.hasAcceptedTerms ?? false, user.createdAt)    
             }
              console.log(setUser(user as AuthUser)) // authUser being the new format
              //TODO remove hardcoded and get api-key from keystack server
              setApiKey('test_Eg1fVjVCq2DagkgFkPKeWkwR33qNeThTrBjhmDYK6EwRvfup')
              //navigate({ to: '/' })
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
      {!onboarding && !isProvisioning ? (<SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />) : null}
      {/*<Separator orientation='vertical' className='h-6' />*/}
      {children}
    </header>
  )
}

Header.displayName = 'Header'
