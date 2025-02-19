import { Link, useNavigate } from '@tanstack/react-router'
import { useLogout } from '@privy-io/react-auth';
import { useAuthStore } from '@/stores/authStore'
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Avatar } from '@/components/ui/avatar'
import Jazzicon from 'react-jazzicon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { stringToUniqueNumber } from '@/lib/utils'

export function ProfileDropdown() {
  const navigate = useNavigate()
  const { getUser } = useAuthStore((state) => state)
  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User logged out');
      // Any logic you'd like to execute after a user successfully logs out
      navigate({ to: '/sign-in-2' })
    },
  });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            {/*<AvatarImage src='/avatars/01.png' alt='@shadcn' />*/}
            <Jazzicon diameter={32} seed={stringToUniqueNumber(getUser()?.id)} />
            {/*<AvatarFallback>SK</AvatarFallback>*/}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>username</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {getUser()?.email?.address}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          {/*<DropdownMenuItem asChild>
            <Link to='/settings'>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>*/}
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          {/*<DropdownMenuItem>New Team</DropdownMenuItem>*/}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
