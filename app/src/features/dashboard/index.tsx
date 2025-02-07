import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
//import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
//import { RecentSales } from './components/recent-sales'

export default function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/*<TopNav links={topNav} />*/}
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>New Agent</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList className='hidden'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              {/*<TabsTrigger value='analytics' disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>*/}
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Engaged sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>83</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Sessions rejected/time
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>57.0%</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Transfer rate
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>4.7%</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg. session handle time
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>6.4</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg. CSAT
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>3.1</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg. session sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>50.7%</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2'>
              <Card className='h-[300px]'>
                <CardHeader>
                  <CardTitle>Engaged sessions</CardTitle>
                </CardHeader>
                <CardContent className='pl-2 h-[300px] sm:h-[350px]'>
                  <Overview chartType="engaged" />
                </CardContent>
              </Card>
              <Card className='h-[300px]'>
                <CardHeader>
                  <CardTitle>Avg. session handle time (min)</CardTitle>
                </CardHeader>
                <CardContent className='pl-2 h-[300px] sm:h-[350px]'>
                  <Overview chartType="handleTime" />
                </CardContent>
              </Card>
              <Card className='h-[300px]'>
                <CardHeader>
                  <CardTitle>Avg. CSAT</CardTitle>
                </CardHeader>
                <CardContent className='pl-2 h-[300px] sm:h-[350px]'>
                  <Overview chartType="csat" />
                </CardContent>
              </Card>
              <Card className='h-[300px]'>
                <CardHeader>
                  <CardTitle>Sentiment zones</CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <Overview chartType="sentiment" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

/*const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]*/
