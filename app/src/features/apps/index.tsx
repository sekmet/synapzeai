import { useState } from 'react';
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { useQuery } from '@tanstack/react-query';
import { fetchPlugins } from './data/apps';

interface PluginParameters {
  [key: string]: {
    type: string;
    description: string;
  };
}

interface AgentConfig {
  pluginType: string;
  pluginParameters: PluginParameters;
}

interface Plugin {
  logo?: any;
  icon: any;
  name: string;
  version: string;
  description: string;
  author: string;
  githubUrl: string;
  installed: boolean;
  agentConfig?: AgentConfig;
}

const appText = new Map<string, string>([
  ['all', 'All Plugins'],
  ['installed', 'Installed'],
  ['notInstalled', 'Not Installed'],
]);

export default function Apps() {
  const [sort, setSort] = useState('ascending');
  const [appType, setAppType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: apps, isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: () => fetchPlugins(),
  });

  const filteredApps = (apps as Plugin[] ?? [])
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) =>
      appType === 'installed'
        ? app.installed
        : appType === 'notInstalled'
        ? !app.installed
        : true
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Plugins and Integrations
          </h1>
          <p className="text-muted-foreground">
            Here's a list of your plugins for the integration!
          </p>
        </div>
        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Filter plugins..."
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger className="w-36">
                <SelectValue>{appText.get(appType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plugins</SelectItem>
                <SelectItem value="installed">Installed</SelectItem>
                <SelectItem value="notInstalled">Not Installed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-16">
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ascending">
                <div className="flex items-center gap-4">
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="descending">
                <div className="flex items-center gap-4">
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="shadow" />
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <svg
              className="animate-spin h-24 w-24 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="mt-2 text-lg text-gray-500">Loading plugins...</span>
          </div>
        ) : (
          <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((app) => (
              <li
                key={app.name}
                className="rounded-lg border p-4 hover:shadow-md"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div
                    className="flex size-10 items-center justify-center rounded-lg bg-muted p-2"
                  >
                    {app.icon}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${app.installed ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                  >
                    {app.installed ? 'Installed' : 'Install'}
                  </Button>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {app.logo && (
                      <div className="border border-gray-300 dark:border-gray-600 w-10 h-10 rounded-lg mr-1">
                        {app.logo}
                      </div>
                    )}
                    <h2 className="mb-1 font-semibold">{app.name}</h2>
                  </div>
                  <p className="line-clamp-2 text-gray-500">{app.description}</p>
                </div>
                <div className="flex mt-2 justify-end items-end text-[11px] text-gray-500 dark:text-gray-300 gap-1 font-semibold">v{app.version}</div>
              </li>
            ))}
          </ul>
        )}
      </Main>
    </>
  );
}