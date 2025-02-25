import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
//import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Upload, FileText, Layout } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { fetchPluginsListing } from '@/lib/plugins';
import { usePluginStore, PluginItem } from '@/stores/pluginStore';
import { getSubscriptionAllowanceByCustomerId, fetchUserAgents } from '@/lib/api/agent';
import { useAuthStore } from '@/stores/authStore';
//import { toast } from '@/hooks/use-toast'
import clsx from 'clsx';

export default function NewAgent() {
  const { getUser } = useAuthStore();
  const [openDialogLimitReached, setOpenDialogLimitReached] = useState(false)
  const { data: subscriptionAllowance } = useQuery({
    queryKey: ['subscriptionAllowance', getUser()?.id],
    queryFn: () => getSubscriptionAllowanceByCustomerId(getUser()?.id ?? ''),
  })

  if (!subscriptionAllowance) {
    console.error('Active subscription not found');
    //return null;
  }

  const { data: agentsDeployed } = useQuery({
    queryKey: ['agentsDeployed', getUser()?.id],
    queryFn: () => fetchUserAgents(getUser()?.id ?? ''),
  })

  const isAgentsDeployedLimitReached = agentsDeployed && (Number(agentsDeployed.length) === Number(subscriptionAllowance.items));

  if (isAgentsDeployedLimitReached) {
    console.error('Maximum agent deployment reached');
    //return null;
  }

  const { data: pluginsAvailable, isLoading } = useQuery({
    queryKey: ['pluginsAvailable'],
    queryFn: () => fetchPluginsListing(),
  })
  const pluginListing = usePluginStore.getState()

  useEffect(() => {
    if (!isLoading) {
      pluginListing.setPlugins(pluginsAvailable as PluginItem[])
    }

    if (isAgentsDeployedLimitReached || !subscriptionAllowance) {
      setOpenDialogLimitReached(true)
    }

  },[isLoading])
  

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className="flex flex-col max-w-5xl m-auto items-left px-6 py-16 flex-1 text-white pt-[10vh] dark:text-gray-100">
    <h1 className="text-3xl font-bold mb-8 text-gray-700 dark:text-gray-50 items-left">Get started</h1>
    <p className="text-gray-700 text-lg mb-2 dark:text-gray-300">
      To start developing your AI agent, please select one of the options
      provided below. Check our{" "}
      <a href="#" className="text-gray-600 underline hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-100">
        guide
      </a>{" "}
      for reference.
    </p>
    <div className="w-full flex-col m-auto max-w-3xl mt-12 space-y-4 items-center">
    <Link to='/agent/new/upload' disabled={isAgentsDeployedLimitReached || !subscriptionAllowance}>
      <button 
      disabled={isAgentsDeployedLimitReached || !subscriptionAllowance} 
      className={clsx("w-full p-6 mb-3 bg-white rounded-lg flex items-center justify-between", isAgentsDeployedLimitReached || !subscriptionAllowance ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700')}>
        <div className="flex items-center gap-4">
          <Upload className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white">Upload characterfile</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Already have a characterfile? Create an agent with an upload.
            </p>
          </div>
        </div>
        <span className="text-2xl text-gray-700 dark:text-gray-300">→</span>
      </button>
      </Link>
      <Link to='/agent/new/from-scracth' disabled={isAgentsDeployedLimitReached || !subscriptionAllowance}>
      <button 
      disabled={isAgentsDeployedLimitReached || !subscriptionAllowance} 
      className={clsx("w-full p-6 mb-3 bg-white rounded-lg flex items-center justify-between", isAgentsDeployedLimitReached || !subscriptionAllowance ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700')}>
        <div className="flex items-center gap-4">
          <FileText className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white">Build from scratch</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Create an agent by entering details into a form.
            </p>
          </div>
        </div>
        <span className="text-2xl text-gray-700 dark:text-gray-300">→</span>
      </button>
      </Link>
      <Link to='/agent/new/template' disabled={isAgentsDeployedLimitReached || !subscriptionAllowance}>
      <button 
      disabled={isAgentsDeployedLimitReached || !subscriptionAllowance} 
      className={clsx("w-full p-6 mb-3 bg-white rounded-lg flex items-center justify-between", isAgentsDeployedLimitReached || !subscriptionAllowance ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700')}>
        <div className="flex items-center gap-4">
          <Layout className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white">Start with a template</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Create an agent by customizing an existing template.
            </p>
          </div>
        </div>
        <span className="text-2xl text-gray-700 dark:text-gray-300">→</span>
      </button>
      </Link>
    </div>
  </Main>

  <ConfirmDialog
            key='limit-reached'
            open={openDialogLimitReached}
            onOpenChange={() => {
              console.log('open change')
              setOpenDialogLimitReached(false)
            }}
            handleConfirm={() => {
              setOpenDialogLimitReached(false)
              
            }}
            className='max-w-md'
            title={`EARLY BETA: Agent deployment limit reached`}
            desc={
              <>
                <strong className='text-red-600'>The agent deployment limit has been reached.</strong> <br /><br />
                During our early Beta, each account can have up to <strong>{subscriptionAllowance?.items ?? 0} active</strong> agent(s).
                If you need more, please contact us to upgrade your account for more deployments.
              </>
            }
            confirmText='Contact Us'
            cancelBtnText='Cancel'
          />

  </>
  )
}
