import { useState, useEffect } from 'react'
import { Fragment } from 'react/jsx-runtime'
//import { format } from 'date-fns'
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconMessages,
  //IconPaperclip,
  //IconPhone,
  //IconPhotoPlus,
  //IconPlus,
  IconSearch,
  //IconSend,
  //IconVideo,
  IconRobot,
  IconBrandDiscord,
  IconBrandWhatsapp,
  IconBrandGithub,
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandSlack
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { useParams } from '@tanstack/react-router'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import Jazzicon from 'react-jazzicon'
import { NewChat } from './components/new-chat'
import { AgentChat } from './components/chat'
import { ConnectionStatus } from './components/connection-status'
//import { type ChatUser, type Convo } from './data/chat-types'
import { useQuery } from "@tanstack/react-query";
import { fetchUserAgents } from '@/lib/api/agent'
import { useAuthStore } from '@/stores/authStore'
import { useAgentActiveStore, Agent } from '@/stores/agentActive'
import { stringToUniqueNumber } from '@/lib/utils'
import { UUID } from '@/types/elizaosv1'
import { useRouter } from '@tanstack/react-router'

// Fake Data
//import { conversations } from './data/convo.json'

export default function Chats() {
  const router = useRouter();
  const { agentId: agentIdParam } = useParams({ strict: false })
  const agentId = agentIdParam as UUID
  const [search, setSearch] = useState('')
  const { getUser } = useAuthStore((state) => state)
  const { setAgent, getAgent, setRefresh, refresh } = useAgentActiveStore((state) => state)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [mobileSelectedAgent, setMobileSelectedAgent] = useState<Agent | null>(
    null
  )
  //const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  //const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(
  //  null
  //)
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false)

    const { data: userAgents } = useQuery({
      queryKey: ['userAgents'],
      queryFn: () => fetchUserAgents(getUser()?.id ?? ''),
    })
  
    useEffect(() => {
      //console.log({refresh})
      console.log({userAgents}, agentId)
    }, [refresh])

  const activeAgent = getAgent() as Agent ?? null;

  // Filtered data based on the search query
  const filteredChatList = userAgents && userAgents.filter(({ name }: Agent) =>
    name.toLowerCase().includes(search.trim().toLowerCase())
  )

  /*const currentMessage = selectedAgent?.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, 'd MMM, yyyy')

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = []
      }

      // Push the current object to the array
      acc[key].push(obj)

      return acc
    },
    {}
  )

  const users = conversations.map(({ messages, ...user }) => user)*/

  return activeAgent ? (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          {/* Left Side */}
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Agent Chats</h1>
                  <IconMessages size={20} />
                </div>

                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => setCreateConversationDialog(true)}
                  className='rounded-lg'
                >
                  <IconEdit size={24} className='stroke-muted-foreground' />
                </Button>
              </div>

              <label className='flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
                <IconSearch size={15} className='mr-2 stroke-slate-500' />
                <span className='sr-only'>Search</span>
                <input
                  type='text'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
                  placeholder='Search chat...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className='-mx-3 h-full p-3'>
              {filteredChatList && filteredChatList.map((chatUsr: Agent) => {
                const { id, name } = chatUsr
                /*const { id, username, messages, fullName } = chatUsr
                const lastConvo = messages[0]
                const lastMsg =
                  lastConvo.sender === 'You'
                    ? `You: ${lastConvo.message}`
                    : lastConvo.message*/
                return (
                  <Fragment key={id}>
                    <button
                      type='button'
                      className={cn(
                        `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                        activeAgent?.id === id && 'sm:bg-muted'
                      )}
                      onClick={() => {
                        setAgent(chatUsr)
                        setSelectedAgent(chatUsr)
                        setMobileSelectedAgent(chatUsr)
                        setRefresh(new Date().getTime())
                        router.navigate({ to: `/chats/${chatUsr.metadata.agentClientId}` })
                      }}
                    >
                      <div className='flex gap-2'>
                        <div className='relative h-8 w-8' >
                      <Jazzicon diameter={32} seed={stringToUniqueNumber(`${name}:${id}`)} />
                      </div>
                        {/*<Avatar>
                          <AvatarImage src={profile} alt={username} />
                          <AvatarFallback>{username}</AvatarFallback>
                        </Avatar>*/}
                        <div>
                          <span className='col-start-2 row-span-2 font-medium'>
                            {name}
                          </span>
                          <span className='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground'>
                          <ConnectionStatus />
                          </span>
                          {/*<span className='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground'>
                            {lastMsg}
                          </span>*/}
                        </div>
                      </div>
                    </button>
                    <Separator className='my-1' />
                  </Fragment>
                )
              })}
            </ScrollArea>
          </div>

          {/* Right Side */}
          {selectedAgent ? (
            <div
              className={cn(
                'absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
                mobileSelectedAgent && 'left-0 flex'
              )}
            >
              {/* Top Part */}
              <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
                {/* Left */}
                <div className='flex gap-3'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='-ml-2 h-full sm:hidden'
                    onClick={() => setMobileSelectedAgent(null)}
                  >
                    <IconArrowLeft />
                  </Button>
                  <div className='flex items-center gap-2 lg:gap-4'>
                  <Jazzicon diameter={36} seed={stringToUniqueNumber(`${selectedAgent.name}:${selectedAgent.id}`)} />
                    {/*<Avatar className='size-9 lg:size-11'> 
                      <AvatarImage
                        src={selectedUser.profile}
                        alt={selectedUser.username}
                      />
                      <AvatarFallback>{selectedUser.username}</AvatarFallback>
                    </Avatar>*/}
                    <div>
                      <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                        {selectedAgent.name}
                      </span>
                      <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                        {`${selectedAgent.name} Agent`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <IconBrandTwitter size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <IconBrandTelegram size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <IconBrandWhatsapp size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <IconBrandDiscord size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <IconBrandSlack size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <IconBrandGithub size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                  >
                    <IconDotsVertical className='stroke-muted-foreground sm:size-5' />
                  </Button>
                </div>
              </div>

              {/* Conversation */}
              <AgentChat agentId={agentId} />

              {/*<div className='flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0'>
                <div className='flex size-full flex-1'>
                  <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                    <div className='chat-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                      {currentMessage &&
                        Object.keys(currentMessage).map((key) => (
                          <Fragment key={key}>
                            {currentMessage[key].map((msg, index) => (
                              <div
                                key={`${msg.sender}-${msg.timestamp}-${index}`}
                                className={cn(
                                  'chat-box max-w-72 break-words px-3 py-2 shadow-lg',
                                  msg.sender === 'You'
                                    ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                                    : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                                )}
                              >
                                {msg.message}{' '}
                                <span
                                  className={cn(
                                    'mt-1 block text-xs font-light italic text-muted-foreground',
                                    msg.sender === 'You' && 'text-right'
                                  )}
                                >
                                  {format(msg.timestamp, 'h:mm a')}
                                </span>
                              </div>
                            ))}
                            <div className='text-center text-xs'>{key}</div>
                          </Fragment>
                        ))}
                    </div>
                  </div>
                </div>
                <form className='flex w-full flex-none gap-2'>
                  <div className='flex flex-1 items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4'>
                    <div className='space-x-1'>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        className='h-8 rounded-md'
                      >
                        <IconPlus
                          size={20}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        className='hidden h-8 rounded-md lg:inline-flex'
                      >
                        <IconPhotoPlus
                          size={20}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        className='hidden h-8 rounded-md lg:inline-flex'
                      >
                        <IconPaperclip
                          size={20}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                    </div>
                    <label className='flex-1'>
                      <span className='sr-only'>Chat Text Box</span>
                      <input
                        type='text'
                        placeholder='Type your messages...'
                        className='h-8 w-full bg-inherit focus-visible:outline-none'
                      />
                    </label>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='hidden sm:inline-flex'
                    >
                      <IconSend size={20} />
                    </Button>
                  </div>
                  <Button className='h-full sm:hidden'>
                    <IconSend size={18} /> Send
                  </Button>
                </form>
              </div>*/}

            </div>
          ) : (
            <div
              className={cn(
                'absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex'
              )}
            >
              <div className='flex flex-col items-center space-y-6'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full border-2 border-white'>
                  <IconMessages className='h-8 w-8' />
                </div>
                <div className='space-y-2 text-center'>
                  <h1 className='text-xl font-semibold'>Your agent chats</h1>
                  <p className='text-sm text-gray-400'>
                    Send a message to agent to start a chat.
                  </p>
                </div>
                <Button
                  className='bg-orange-500 px-6 text-white hover:bg-orange-600'
                  onClick={() => setCreateConversationDialog(true)}
                >
                  Send message
                </Button>
              </div>
            </div>
          )}
        </section>
        <NewChat
          agents={userAgents}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened}
        />
      </Main>
    </>
  ) : (
    <div className='h-svh'>
    <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
      <IconRobot size={72} />
      <h1 className='text-4xl font-bold leading-tight'>No active agent 👀</h1>
      <p className='text-center text-muted-foreground'>
        Please deploy an agent first. <br />
        To start a chat with it!
      </p>
    </div>
  </div>
  );
}
