import { Link } from '@tanstack/react-router'
//import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
//import { Upload, FileText, Layout } from "lucide-react";
import { ArrowLeft } from "lucide-react";
//import { ThemeToggle } from "./components/ThemeToggle";
import { FileUploadZone } from "@/components/file-upload-zone";

export default function NewAgentUpload() {
  return (
    <>
    <Header fixed>
    <Search />
    <div className='ml-auto flex items-center space-x-4'>
    <ThemeSwitch />
    <ProfileDropdown />
    </div>
    </Header>
    <Main className="px-6 py-16 text-gray-900 pt-[15vh] dark:text-gray-100">
    <div className="max-w-3xl mx-auto">
    <Link to='/agent/new'>
        <button className="flex items-center text-yellow-500 dark:text-yellow-400 mb-8 hover:opacity-80">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back
        </button>
      </Link>
        <h1 className="text-4xl font-semibold mb-4">Upload characterfile</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Deploy your AI agent personality using the Eliza framework, starting
          with a .json characterfile. Click{" "}
          <a href="#" className="text-yellow-500 dark:text-yellow-400 hover:underline">
            here
          </a>{" "}
          to view a characterfile example.
        </p>
        <FileUploadZone />
      </div>
    </Main>
    </>
  )
}