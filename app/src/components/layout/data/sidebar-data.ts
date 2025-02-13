import {
  //IconBarrierBlock,
  IconBrowserCheck,
  //IconBug,
  IconChecklist,
  //IconError404,
  IconHelp,
  IconLayoutDashboard,
  //IconLock,
  //IconLockAccess,
  //IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  //IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconRobot,
  //IconUserOff,
  //IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const fetchUserAgents = async (userId: string) => {
  if (!userId) return [];
  console.log('fetchUserAgents ', userId)
  const userOrg = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations/${userId}/organization`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  const org = await userOrg.json();

  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents/${org[0]}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};


export const sidebarData: SidebarData = {
  user: {
    name: 'sekmet',
    email: 'sekmet@open4g.com',
    avatar: '/avatars/01.jpg',
  },
  teams: [
    {
      name: 'C3PO',
      logo: Command,
      plan: 'Basic plan',
    },
    {
      name: 'Trump',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Eliza',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        /*{
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },*/
        /*{
          title: 'Agents',
          url: '/users',
          icon: IconUsers,
        },*/
        {
          title: 'Logs',
          url: '/logs',
          icon: IconChecklist,
          badge: '139',
        },
        {
          title: 'Plugins',
          url: '/apps',
          icon: IconPackages,
        }
      ],
    },
    /*{
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/401',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/403',
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: '/404',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/500',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/503',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },*/
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Agent',
              url: '/settings/agent',
              icon: IconRobot
            },
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
