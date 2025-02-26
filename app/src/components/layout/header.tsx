import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
//import { Separator } from '@/components/ui/separator'
//import { useNavigate } from '@tanstack/react-router'
import { SidebarTrigger } from '@/components/ui/sidebar'
//import { usePrivy, useLogin } from '@privy-io/react-auth'
//import { useQuery } from "@tanstack/react-query";
import { useAuthStore/*, AuthUser*/ } from '@/stores/authStore'
//import { fetchCurrentUser, createUser } from '@/lib/users'
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
  const { getOnboarding, /*setOnboarding, setUser, getUser, setApiKey */} = useAuthStore((state) => state)
  const onboarding = !getOnboarding().completed
  const isProvisioning = getProvisioning().isProvisioning;

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
