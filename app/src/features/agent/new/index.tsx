import { Link } from '@tanstack/react-router'
//import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Upload, FileText, Layout } from "lucide-react";

export default function NewAgent() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className="flex flex-col items-center px-6 py-16 flex-1 text-white pt-[15vh] dark:text-gray-100">
    <h1 className="text-6xl font-bold mb-8 text-gray-700 dark:text-gray-50">Get started</h1>
    <p className="text-gray-700 text-lg mb-2 dark:text-gray-300">
      To start developing your AI agent, please select one of the options
      provided below. Check our{" "}
      <a href="#" className="text-gray-600 underline hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-100">
        guide
      </a>{" "}
      for reference.
    </p>
    <div className="w-full max-w-3xl mt-12 space-y-4">
    <Link to='/agent/new/upload'>
      <button className="w-full p-6 bg-white rounded-lg flex items-center justify-between hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
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
      <Link to='/agent/new/from-scracth'>
      <button className="w-full p-6 bg-white rounded-lg flex items-center justify-between hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
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
      <Link to='/agent/new/template'>
      <button className="w-full p-6 bg-white rounded-lg flex items-center justify-between hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
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
  </>
  )
}
