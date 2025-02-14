import { Link } from '@tanstack/react-router'
import { AuthUser } from '@/stores/authStore'
import { useLogout } from '@privy-io/react-auth';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  //CreditCard,
  LogOut,
  //Sparkles,
} from 'lucide-react'
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Avatar } from '@/components/ui/avatar'
import Jazzicon from 'react-jazzicon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavUser({
  user,
}: {
  user: AuthUser | null
}) {
  const { isMobile } = useSidebar()
  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User logged out');
      // Any logic you'd like to execute after a user successfully logs out
    },
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                {/*<AvatarImage src={'/avatars/01.jpg'} alt={user?.id} />
                <AvatarFallback className='rounded-lg'>SK</AvatarFallback>*/}
                <Jazzicon diameter={32} seed={Number(user?.id)} />
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{'username'}</span>
                <span className='truncate text-xs'>{user?.email?.address}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  {/*<AvatarImage src={'/avatars/01.jpg'} alt={user?.id} />
                  <AvatarFallback className='rounded-lg'>SK</AvatarFallback>*/}
                  <Jazzicon diameter={32} seed={Number(user?.id)} />
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{'username'}</span>
                  <span className='truncate text-xs'>{user?.email?.address}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/*<DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>*/}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to='/settings/account'>
                  <BadgeCheck />
                  Account
                </Link>
              </DropdownMenuItem>
              {/*<DropdownMenuItem asChild>
                <Link to='/settings'>
                  <CreditCard />
                  Billing
                </Link>
              </DropdownMenuItem>*/}
              <DropdownMenuItem asChild>
                <Link to='/settings/notifications'>
                  <Bell />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
