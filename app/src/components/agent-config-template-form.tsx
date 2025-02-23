import { useRouter, useCanGoBack, useParams } from '@tanstack/react-router'
import { useState, useEffect, KeyboardEvent } from "react"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
//import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Trash2, 
  ChevronsUpDown, 
  Check, 
  ArrowLeft 
} from "lucide-react"
import {
  IconDatabaseCog,
  IconRouter,
  IconPlug,
} from '@tabler/icons-react'
//import { Checkbox } from "@/components/ui/checkbox"
//import { toast } from '@/hooks/use-toast'
import { TagInput } from '@/components/ui/tag-input'
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { /*getAvailableTemplates,*/ loadTemplate, saveTemplateState } from '@/lib/templates'
import { useAgentDeployStore } from '@/stores/agentDeployStore';
//import { clsx } from 'clsx'
import { type AgentSettings, type MessageExample, type ListItem, type Plugin } from '@/types/templates'
import { usePluginStore } from '@/stores/pluginStore';

const pluginListing = usePluginStore.getState()

/*const clients = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "discord", label: "Discord" },
  { value: "slack", label: "Slack" },
  { value: "telegram", label: "Telegram" },
]*/

const plugins: Plugin[] = pluginListing.getPlugins()
const pluginsAdapters = plugins.filter((plugin) => plugin.package.includes('adapter-'))
const pluginsClients = plugins.filter((plugin) => plugin.package.includes('client-'))
const pluginsPlugins = plugins.filter((plugin) => plugin.package.includes('plugin-'))

/*[
  {
    value: "0g",
    label: "0g",
    category: "Blockchain & Web3",
    package: "@elizaos/plugin-0g",
    description: "A plugin for storing data using the 0G protocol within the ElizaOS ecosystem.",
  },
  {
    value: "3d-generation",
    label: "3D Generation",
    category: "Blockchain & Web3",
    package: "@elizaos/plugin-3d-generation",
    description: "A plugin for generating 3D models using the FAL.ai API within the ElizaOS ecosystem.",
  },
  {
    value: "abstract",
    label: "Abstract",
    category: "Blockchain & Web3",
    package: "@elizaos/plugin-abstract",
    description: "A plugin for interacting with the Abstract blockchain network within the ElizaOS ecosystem.",
  },
  {
    value: "aptos",
    label: "Aptos",
    category: "Blockchain & Web3",
    package: "@elizaos/plugin-aptos",
    description: "A plugin for interacting with the Aptos blockchain network within the ElizaOS ecosystem.",
  },
  {
    value: "avalanche",
    label: "Avalanche",
    category: "Blockchain & Web3",
    package: "@elizaos/plugin-avalanche",
    description: "A plugin for interacting with the Avalanche blockchain network within the ElizaOS ecosystem.",
  },
]*/

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  model: z.string().min(1, 'Model is required')
})

type FormValues = z.infer<typeof formSchema>

export default function AgentConfigTemplateForm({ title }: { title: string }) {
  const { templateId: templateIdParam } = useParams({ strict: false })
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      model: ''
    }
  })
  
  const canGoBack = useCanGoBack()
  const router = useRouter()
  const [name, setName] = useState("")
  const { getProvisioning, setProvisioning } = useAgentDeployStore((state) => state);
  const setIsProvisioning = (status: boolean) => setProvisioning({ ...getProvisioning(), completed: false, currentStep: 0, isProvisioning: status })
  const [settings, setSettings] = useState<AgentSettings>()
  const [modelProvider, setModelProvider] = useState("")
  const [postExamples, setPostExamples] = useState<string[]>([])
  const [topics, setTopics] = useState<string[]>(["star wars"])
  const [newTopic, setNewTopic] = useState("")
  const [adjectives, setAdjectives] = useState<string[]>([
    "proper",
    "meticulous",
    "anxious",
    "diplomatic",
    "protocol-minded",
    "formal",
    "loyal",
  ])
  const [newAdjective, setNewAdjective] = useState("")
  const [bioItems, setBioItems] = useState<ListItem[]>([
    { id: "1", content: "C-3PO is a protocol droid fluent in over six million forms of communication." },
    {
      id: "2",
      content: "Extremely knowledgeable and proper, with a tendency to be anxious about doing things correctly.",
    },
    { id: "3", content: "Always eager to help while maintaining strict protocol and proper etiquette." },
    { id: "4", content: "Known for being somewhat dramatic but ultimately reliable and loyal." },
  ])
  const [loreItems, setLoreItems] = useState<ListItem[]>([
    {
      id: "1",
      content: "Built to serve human-cyborg relations, with expertise in etiquette, customs, and translation.",
    },
    { id: "2", content: "Has served in various diplomatic missions across the galaxy." },
    { id: "3", content: "Best friends with R2-D2 despite their contrasting personalities." },
    { id: "4", content: "Known for his golden plating and proper British accent." },
  ])
  const [knowledgeItems, setKnowledgeItems] = useState<ListItem[]>([{ id: "1", content: "Protocol and etiquette" }])
  const [messageExamples, setMessageExamples] = useState<MessageExample[]>([
    {
      id: "1",
      userMessage: "Can you help me with this task?",
      assistantMessage:
        "Oh my! Of course, I would be more than happy to assist. Though I must warn you, the probability of completing this task successfully would increase significantly if we follow proper protocol. Shall we proceed?",
    },
    {
      id: "2",
      userMessage: "This seems difficult.",
      assistantMessage:
        "Oh dear, oh dear! While the task does appear rather daunting, I am fluent in over six million forms of problem-solving. Perhaps I could suggest a more efficient approach? Though I do hope we don't all end up in pieces!",
    },
  ])
  const [styleAllItems, setStyleAllItems] = useState<ListItem[]>([{ id: "1", content: "uses FULL CAPS for key phrases and emphasis" }])
  const [styleChatItems, setStyleChatItems] = useState<ListItem[]>([{ id: "1", content: "directly addresses questioner's concerns" }])
  const [stylePostItems, setStylePostItems] = useState<ListItem[]>([{ id: "1", content: "uses ALL CAPS for key points" }])

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  
  const [openClients, setOpenClients] = useState(false)
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  
  const [openAdapters, setOpenAdapters] = useState(false)
  const [selectedAdapters, setSelectedAdapters] = useState<string[]>([])

  const [openPlugins, setOpenPlugins] = useState(false)
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([])

  //const [openTemplates, setOpenTemplates] = useState(false)
  //const templates = getAvailableTemplates()

  // Effect to save state changes
  useEffect(() => {
    const saveState = async () => {
      setIsProvisioning(false)
      const template = {
        name,
        clients: selectedClients,
        modelProvider,
        settings: settings as AgentSettings,
        plugins: selectedPlugins,
        bio: bioItems.map(item => item.content),
        lore: loreItems.map(item => item.content),
        knowledge: knowledgeItems.map(item => item.content),
        messageExamples: messageExamples.map(ex => [{
          user: ex.userMessage,
          content: { text: ex.assistantMessage }
        }]),
        postExamples,
        style: {
          all: styleAllItems.map(item => item.content),
          chat: styleChatItems.map(item => item.content),
          post: stylePostItems.map(item => item.content),
        },
        topics,
        adjectives
      }
      
      if (name && selectedTemplate) { // Only save if we have a name set
        await saveTemplateState(template)
      }
    }

    saveState()
  }, [name, settings, selectedClients, modelProvider, selectedPlugins, bioItems, 
      loreItems, knowledgeItems, messageExamples, topics, 
      styleAllItems, styleChatItems, stylePostItems, adjectives, selectedTemplate])


  useEffect(() => {
    if (templateIdParam && !name && !selectedTemplate) {
      handleTemplateSelect(templateIdParam)
    }
  }, [])

  useEffect(() => {
    if (name) {
      form.setValue('name', name)
    }
    if (modelProvider) {
      form.setValue('model', modelProvider.toLowerCase())
    }
  }, [name, modelProvider])


  const handleAddTopic = (e: KeyboardEvent) => {
    if (e.key === "Enter" && newTopic.trim()) {
      setTopics([...topics, newTopic.trim()])
      setNewTopic("")
    }
  }

  const handleAddAdjective = (e: KeyboardEvent) => {
    if (e.key === "Enter" && newAdjective.trim()) {
      setAdjectives([...adjectives, newAdjective.trim()])
      setNewAdjective("")
    }
  }

  //const handleRemoveTopic = (topic: string) => {
  //  setTopics(topics.filter((t) => t !== topic))
  //}

  //const handleRemoveAdjective = (adjective: string) => {
  //  setAdjectives(adjectives.filter((a) => a !== adjective))
 //}

  const handleAddItem = (section: "bio" | "lore" | "knowledge" | "style-all" | "style-chat" | "style-post") => {
    const newItem = { id: Date.now().toString(), content: "" }
    switch (section) {
      case "bio":
        setBioItems([...bioItems, newItem])
        break
      case "lore":
        setLoreItems([...loreItems, newItem])
        break
      case "knowledge":
        setKnowledgeItems([...knowledgeItems, newItem])
        break
      case "style-all":
        setStyleAllItems([...styleAllItems, newItem])
        break
      case "style-chat":
        setStyleChatItems([...styleChatItems, newItem])
        break
      case "style-post":
        setStylePostItems([...stylePostItems, newItem])
        break
    }
  }

  const handleRemoveItem = (section: "bio" | "lore" | "knowledge" | "style-all" | "style-chat" | "style-post", id: string) => {
    switch (section) {
      case "bio":
        setBioItems(bioItems.filter((item) => item.id !== id))
        break
      case "lore":
        setLoreItems(loreItems.filter((item) => item.id !== id))
        break
      case "knowledge":
        setKnowledgeItems(knowledgeItems.filter((item) => item.id !== id))
        break
      case "style-all":
        setStyleAllItems(styleAllItems.filter((item) => item.id !== id))
        break
      case "style-chat":
        setStyleChatItems(styleChatItems.filter((item) => item.id !== id))
        break
      case "style-post":
        setStylePostItems(stylePostItems.filter((item) => item.id !== id))
        break
    }
  }

  const handleUpdateItem = (section: "bio" | "lore" | "knowledge" | "style-all" | "style-chat" | "style-post", id: string, content: string) => {
    switch (section) {
      case "bio":
        setBioItems(bioItems.map((item) => (item.id === id ? { ...item, content } : item)))
        break
      case "lore":
        setLoreItems(loreItems.map((item) => (item.id === id ? { ...item, content } : item)))
        break
      case "knowledge":
        setKnowledgeItems(knowledgeItems.map((item) => (item.id === id ? { ...item, content } : item)))
        break
      case "style-all":
        setStyleAllItems(styleAllItems.map((item) => (item.id === id ? { ...item, content } : item)))
        break
      case "style-chat":
        setStyleChatItems(styleChatItems.map((item) => (item.id === id ? { ...item, content } : item)))
        break
      case "style-post":
        setStylePostItems(stylePostItems.map((item) => (item.id === id ? { ...item, content } : item)))
        break
    }
  }

  const handleTemplateSelect = async (templateName: string) => {
    console.log(templateName)
    const template = await loadTemplate(templateName)
    
    if (template) {
      setName(template.name)
      setSettings(template.settings || {})
      setModelProvider(template.modelProvider || '')
      setSelectedClients(template.clients || [])
      setSelectedPlugins(template.plugins || [])
      setPostExamples(template.postExamples || [])
      setTopics(template.topics || [])
      setAdjectives(template.adjectives || [])
      setBioItems(template.bio?.map((content, index) => ({ id: (index + 1).toString(), content })) || [])
      setLoreItems(template.lore?.map((content, index) => ({ id: (index + 1).toString(), content })) || [])
      setKnowledgeItems(template.knowledge?.map((content, index) => ({ id: (index + 1).toString(), content })) || [])
      const styleAll = Array.from(new Set(template.style.all))
      const styleChat = Array.from(new Set(template.style.chat))
      const stylePost = Array.from(new Set(template.style.post))
      setStyleAllItems(styleAll?.map((content: string, index: number) => ({ id: (index + 1).toString(), content })) || [])
      setStyleChatItems(styleChat?.map((content: string, index: number) => ({ id: (index + 1).toString(), content })) || [])
      setStylePostItems(stylePost?.map((content: string, index: number) => ({ id: (index + 1).toString(), content })) || [])
      
      const formattedExamples = template.messageExamples?.map((exchange, index) => ({
        id: (index + 1).toString(),
        userMessage: exchange[0].content.text,
        assistantMessage: exchange[1].content.text
      })) || []
      setMessageExamples(formattedExamples)

      // set template to state
      setSelectedTemplate(template)

      /*toast({
        title: `🤖 ${template.name} template`,
        description: "Agent template loaded...",
        duration: 1000
      })*/
    }
  }

  const handleAddExample = () => {
    const newExample = {
      id: Date.now().toString(),
      userMessage: "",
      assistantMessage: "",
    }
    setMessageExamples([...messageExamples, newExample])
  }

  const handleRemoveExample = (id: string) => {
    setMessageExamples(messageExamples.filter((example) => example.id !== id))
  }

  const handleUpdateExample = (id: string, field: "userMessage" | "assistantMessage", value: string) => {
    setMessageExamples(messageExamples.map((example) => (example.id === id ? { ...example, [field]: value } : example)))
  }

  const renderList = (section: "bio" | "lore" | "knowledge" | "style-all" | "style-chat" | "style-post", items: ListItem[], description: string) => (
    <div className="space-y-2">
      <p className="text-sm text-gray-900 dark:text-white">{description}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <Textarea
              value={item.content}
              onChange={(e) => handleUpdateItem(section, item.id, e.target.value)}
              className="min-h-[44px] flex-1 bg-muted/50 resize-none text-gray-900 dark:text-white"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => handleRemoveItem(section, item.id)}
            >
              <Trash2 className="h-4 w-4 text-gray-900 dark:text-white" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        className="w-full mt-2 text-gray-900 dark:text-white hover:text-foreground"
        onClick={() => handleAddItem(section)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add more
      </Button>
    </div>
  )

  const renderMessageExamples = () => (
    <div className="space-y-2">
      <p className="text-sm text-gray-900 dark:text-white">
        Sample conversations for establishing interaction patterns. Helps establish the character's conversational
        style.
      </p>
      <div className="space-y-4">
        {messageExamples.map((example, index) => (
          <div key={example.id} className="relative rounded-lg bg-card p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Example #{index + 1}</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveExample(example.id)}>
                <Trash2 className="h-4 w-4 text-gray-900 dark:text-white" />
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium mb-2 text-gray-900 dark:text-white">User</p>
                <Textarea
                  value={example.userMessage}
                  onChange={(e) => handleUpdateExample(example.id, "userMessage", e.target.value)}
                  placeholder="Enter user message..."
                  className="min-h-[44px] bg-transparent border-0 p-0 focus-visible:ring-0 resize-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="rounded-lg bg-muted/50 p-3 ml-8">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium mb-2 text-gray-900 dark:text-white">{name}</p>
                </div>
                <Textarea
                  value={example.assistantMessage}
                  onChange={(e) => handleUpdateExample(example.id, "assistantMessage", e.target.value)}
                  placeholder="Enter assistant response..."
                  className="min-h-[44px] bg-transparent border-0 p-0 focus-visible:ring-0 resize-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        className="w-full mt-2 text-gray-900 dark:text-white hover:text-foreground"
        onClick={handleAddExample}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add more
      </Button>
    </div>
  )

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    router.navigate({to: '/agent/new/secrets'})
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-full space-y-6">
      {canGoBack ? (
        <button onClick={() => router.history.back()} className="flex items-center text-yellow-500 dark:text-yellow-400 mb-6 hover:opacity-80">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back
        </button>) : null}

        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">{title ?? "Configure your agent"}</h1>
        </div>

        {/*<Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Select a template to get started</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4">
            {templates.map((template) => (
              <Button 
              key={template} 
              onClick={() => handleTemplateSelect(template)} 
              variant="outline" 
              className={clsx("h-24 flex flex-col items-center justify-center", name === template && "ring-2 ring-foreground text-muted bg-muted-foreground")}>
                {template}
              </Button>
            ))}
          </CardContent>
        </Card>*/}

        <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="name" className="text-gray-900 dark:text-white text-lg font-semibold">Name</Label>
            <Input 
              id="name" 
              className="text-gray-900 dark:text-white" 
              placeholder="Enter agent name" 
              {...form.register('name')}
              onChange={(e) => {
                setName(e.target.value)
                form.setValue('name', e.target.value)
              }} 
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>


          <div className="space-y-4">
            <Label htmlFor="model" className="text-gray-900 dark:text-white text-lg font-semibold">Model provider</Label>
            <Select 
              value={modelProvider.toLowerCase()}
              onValueChange={(value) => {
                form.setValue('model', value)
                setModelProvider(value)
              }}
              {...form.register('model')}
            >
              <SelectTrigger>
                <SelectValue 
                placeholder="Select provider" 
                className="text-gray-900 dark:text-white"
                />
              </SelectTrigger>
              <SelectContent className="text-gray-900 dark:text-white">
                <SelectItem value="openai"><span className="text-gray-900 dark:text-white">OpenAI</span></SelectItem>
                <SelectItem value="anthropic"><span className="text-gray-900 dark:text-white">Anthropic</span></SelectItem>
                <SelectItem value="google"><span className="text-gray-900 dark:text-white">Google</span></SelectItem>
                <SelectItem value="groq"><span className="text-gray-900 dark:text-white">Groq</span></SelectItem>
                <SelectItem value="grok"><span className="text-gray-900 dark:text-white">xAI Grok</span></SelectItem>
                <SelectItem value="claude_vertex"><span className="text-gray-900 dark:text-white">Claude Vertex</span></SelectItem>
                <SelectItem value="together"><span className="text-gray-900 dark:text-white">Together</span></SelectItem>
                <SelectItem value="eternalai"><span className="text-gray-900 dark:text-white">EternalAI</span></SelectItem>
                <SelectItem value="mistral"><span className="text-gray-900 dark:text-white">Mistral</span></SelectItem>
                <SelectItem value="redpill"><span className="text-gray-900 dark:text-white">Redpill</span></SelectItem>
                <SelectItem value="openrouter"><span className="text-gray-900 dark:text-white">OpenRouter</span></SelectItem>
                <SelectItem value="ollama"><span className="text-gray-900 dark:text-white">Ollama</span></SelectItem>
                <SelectItem value="llama_cloud"><span className="text-gray-900 dark:text-white">Llama Cloud</span></SelectItem>
                <SelectItem value="heurist"><span className="text-gray-900 dark:text-white">Heurist</span></SelectItem>
                <SelectItem value="galadriel"><span className="text-gray-900 dark:text-white">Galadriel</span></SelectItem>
                <SelectItem value="falai"><span className="text-gray-900 dark:text-white">FalAI</span></SelectItem>
                <SelectItem value="gaianet"><span className="text-gray-900 dark:text-white">Gaia Net</span></SelectItem>
                <SelectItem value="ali_bailian"><span className="text-gray-900 dark:text-white">Ali Bailian</span></SelectItem>
                <SelectItem value="volengine"><span className="text-gray-900 dark:text-white">VolEngine</span></SelectItem>
                <SelectItem value="nanogpt"><span className="text-gray-900 dark:text-white">NanoGPT</span></SelectItem>
                <SelectItem value="hyperbolic"><span className="text-gray-900 dark:text-white">Hyperbolic</span></SelectItem>
                <SelectItem value="venice"><span className="text-gray-900 dark:text-white">Venice</span></SelectItem>
                <SelectItem value="nvidia"><span className="text-gray-900 dark:text-white">NVIDIA</span></SelectItem>
                <SelectItem value="nineteen_ai"><span className="text-gray-900 dark:text-white">Nineteen AI</span></SelectItem>
                <SelectItem value="akash_chat_api"><span className="text-gray-900 dark:text-white">Akash Chat API</span></SelectItem>
                <SelectItem value="livepeer"><span className="text-gray-900 dark:text-white">Livepeer</span></SelectItem>
                <SelectItem value="letzai"><span className="text-gray-900 dark:text-white">LetzAI</span></SelectItem>
                <SelectItem value="deepseek"><span className="text-gray-900 dark:text-white">DeepSeek</span></SelectItem>
                <SelectItem value="infera"><span className="text-gray-900 dark:text-white">Infera</span></SelectItem>
                <SelectItem value="bedrock"><span className="text-gray-900 dark:text-white">Bedrock</span></SelectItem>
                <SelectItem value="atoma"><span className="text-gray-900 dark:text-white">Atoma</span></SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.model && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.model.message}
              </p>
            )}
          </div>

          {/*<div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <Label className="text-gray-900 dark:text-white text-lg font-semibold">Clients</Label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">Supported client types, such as Discord or X</p>
            </div>
            <Popover open={openClients} onOpenChange={setOpenClients}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClients}
                  className="w-full justify-between text-gray-900 dark:text-white"
                >
                  {selectedClients.length === 0
                    ? "Select clients..."
                    : clients
                        .filter((client) => selectedClients.includes(client.value))
                        .map((client) => client.label)
                        .join(", ")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-gray-900 dark:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command className="w-full" value={selectedClients.join(", ")}>
                  <CommandInput placeholder="Search clients..." />
                  <CommandList>
                    <CommandEmpty>No client found.</CommandEmpty>
                    <CommandGroup>
                      {clients.map((client) => (
                        <CommandItem
                          key={client.value}
                          onSelect={() => {
                            setSelectedClients((prev) =>
                              prev.includes(client.value)
                                ? prev.filter((item) => item !== client.value)
                                : [...prev, client.value],
                            )
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedClients.includes(client.value) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {client.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>*/}

          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <Label className="text-gray-900 dark:text-white text-lg font-semibold">Clients</Label>
              <span className="text-xs text-gray-900 dark:text-white">Optional</span>
            </div>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
            Supported client types, such as Discord or X
            </p>
            <Popover open={openClients} onOpenChange={setOpenClients}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClients}
                  className="w-full justify-between text-gray-900 dark:text-white"
                >
                  {selectedClients.length === 0
                    ? "Select clients..."
                    : pluginsClients
                        .filter((client) => selectedClients.includes(client.value.replace('client-', '')))
                        .map((client) => client.label)
                        .join(", ")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-gray-900 dark:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-sm sm:max-w-5xl p-0" align="start">
                <Command className="w-full" value={selectedClients.join(", ")}>
                  <CommandInput placeholder="Search clients..." />
                  <CommandList>
                    <CommandEmpty>No client found.</CommandEmpty>
                    <CommandGroup>
                      {pluginsClients.map((plugin) => (
                        <CommandItem
                          key={plugin.package}
                          onSelect={() => {
                            setSelectedClients((prev) =>
                              prev.includes(plugin.value.replace('client-', ''))
                                ? prev.filter((item) => item !== plugin.value.replace('client-', ''))
                                : [...prev, plugin.value.replace('client-', '')],
                            )
                          }}
                          className="flex flex-col items-start py-3"
                        >
                          <div className="flex items-center w-full">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                selectedClients.includes(plugin.value.replace('client-', '')) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <IconRouter />
                                <span className="font-medium">{plugin.label}</span>
                                <span className="text-xs text-gray-900 dark:text-white px-2 py-0.5 rounded-md bg-muted">
                                  {plugin.category}
                                </span>
                              </div>
                              <div className="text-xs text-gray-900 dark:text-white mt-1">{plugin.package}</div>
                              <div className="text-sm text-gray-900 dark:text-white mt-1 truncate">{plugin.description}</div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>


          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <Label className="text-gray-900 dark:text-white text-lg font-semibold">Adapters</Label>
              <span className="text-xs text-gray-900 dark:text-white">Optional</span>
            </div>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              Supported database adapters, such as Postgres or Mongo db
            </p>
            <Popover open={openAdapters} onOpenChange={setOpenAdapters}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAdapters}
                  className="w-full justify-between text-gray-900 dark:text-white"
                >
                  {selectedAdapters.length === 0
                    ? "Select adapters..."
                    : pluginsAdapters
                        .filter((adapter) => selectedAdapters.includes(adapter.package))
                        .map((adapter) => adapter.label)
                        .join(", ")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-gray-900 dark:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-sm sm:max-w-5xl p-0" align="start">
                <Command className="w-full" value={selectedAdapters.join(", ")}>
                  <CommandInput placeholder="Search adapters..." />
                  <CommandList>
                    <CommandEmpty>No adapter found.</CommandEmpty>
                    <CommandGroup>
                      {pluginsAdapters.map((plugin) => (
                        <CommandItem
                          key={plugin.package}
                          onSelect={() => {
                            setSelectedAdapters((prev) =>
                              prev.includes(plugin.package)
                                ? prev.filter((item) => item !== plugin.package)
                                : [...prev, plugin.package],
                            )
                          }}
                          className="flex flex-col items-start py-3"
                        >
                          <div className="flex items-center w-full">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                selectedAdapters.includes(plugin.package) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <IconDatabaseCog />
                                <span className="font-medium">{plugin.label}</span>
                                <span className="text-xs text-gray-900 dark:text-white px-2 py-0.5 rounded-md bg-muted">
                                  {plugin.category}
                                </span>
                              </div>
                              <div className="text-xs text-gray-900 dark:text-white mt-1">{plugin.package}</div>
                              <div className="text-sm text-gray-900 dark:text-white mt-1 truncate">{plugin.description}</div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <Label className="text-gray-900 dark:text-white text-lg font-semibold">Plugins</Label>
              <span className="text-xs text-gray-900 dark:text-white">Optional</span>
            </div>
            <p className="text-sm text-gray-900 dark:text-white mt-1">
              Plugins extend Eliza's core functionality with additional features.
            </p>
            <Popover open={openPlugins} onOpenChange={setOpenPlugins}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPlugins}
                  className="w-full justify-between text-gray-900 dark:text-white"
                >
                  {selectedPlugins.length === 0
                    ? "Select one or multiple plugins"
                    : pluginsPlugins
                        .filter((plugin) => selectedPlugins.includes(plugin.package))
                        .map((plugin) => plugin.label)
                        .join(", ")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-gray-900 dark:text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-sm sm:max-w-5xl p-0" align="start">
                <Command className="w-full" value={selectedPlugins.join(", ")}>
                  <CommandInput placeholder="Search plugins..." />
                  <CommandList>
                    <CommandEmpty>No plugin found.</CommandEmpty>
                    <CommandGroup>
                      {pluginsPlugins.map((plugin) => (
                        <CommandItem
                          key={plugin.package}
                          onSelect={() => {
                            setSelectedPlugins((prev) =>
                              prev.includes(plugin.package)
                                ? prev.filter((item) => item !== plugin.package)
                                : [...prev, plugin.package],
                            )
                          }}
                          className="flex flex-col items-start py-3"
                        >
                          <div className="flex items-center w-full">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                selectedPlugins.includes(plugin.package) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <IconPlug />
                                <span className="font-medium">{plugin.label}</span>
                                <span className="text-xs text-gray-900 dark:text-white px-2 py-0.5 rounded-md bg-muted">
                                  {plugin.category}
                                </span>
                              </div>
                              <div className="text-xs text-gray-900 dark:text-white mt-1">{plugin.package}</div>
                              <div className="text-sm text-gray-900 dark:text-white mt-1 truncate">{plugin.description}</div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>

                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Accordion type="multiple" className="space-y-4" defaultValue={["bio", "lore", "knowledge", "message-examples", "style"]}>
            <AccordionItem value="bio">
              <AccordionTrigger className="text-gray-900 dark:text-white text-lg font-semibold">Bio</AccordionTrigger>
              <AccordionContent>
                {renderList(
                  "bio",
                  bioItems,
                  "Background information for your character. Includes biographical details about the character, either as one complete biography or several statements that vary.",
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lore">
              <AccordionTrigger className="text-gray-900 dark:text-white text-lg font-semibold">Lore</AccordionTrigger>
              <AccordionContent>
                {renderList(
                  "lore",
                  loreItems,
                  "Backstory elements and unique character traits. These help define personality and can be randomly sampled in conversations.",
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="knowledge">
              <AccordionTrigger className="text-gray-900 dark:text-white text-lg font-semibold">
                Knowledge
                <span className="ml-2 text-xs text-gray-900 dark:text-white">Optional</span>
              </AccordionTrigger>
              <AccordionContent>
                {renderList("knowledge", knowledgeItems, "Facts or references to ground the character's responses")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="message-examples">
              <AccordionTrigger className="text-gray-900 dark:text-white text-lg font-semibold">Message examples</AccordionTrigger>
              <AccordionContent>{renderMessageExamples()}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="style">
              <AccordionTrigger className="text-gray-900 dark:text-white text-lg font-semibold">
                Style
                <span className="ml-2 inline-flex items-end justify-end text-xs text-gray-900 dark:text-white">Optional</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-6">
                  <Accordion type="multiple" defaultValue={["style-all", "style-chat", "style-post"]}>
                  <AccordionItem value="style-all">
                    <AccordionTrigger className="text-gray-900 dark:text-white font-bold">
                      All
                    </AccordionTrigger>
                    <AccordionContent>
                      {renderList("style-all", styleAllItems, "Character's conversational style")}
                    </AccordionContent>
                  </AccordionItem>


                    <AccordionItem value="style-chat">
                      <AccordionTrigger className="text-gray-900 dark:text-white font-bold">Chat</AccordionTrigger>
                      <AccordionContent>
                      {renderList("style-chat", styleChatItems, "Character's conversational chat style")}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="style-post">
                      <AccordionTrigger className="text-gray-900 dark:text-white font-bold">Post</AccordionTrigger>
                      <AccordionContent>
                      {renderList("style-post", stylePostItems, "Character's conversational post style")}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-white text-lg font-semibold">Topics</Label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                List of subjects the character is interested in or knowledgeable about, used to guide conversations and
                generate relevant content. Helps maintain character consistency.
              </p>
            </div>
            <div className="relative">
            <TagInput
                  {...topics}
                  placeholder="Add topic..."
                  tags={topics}
                  className='sm:min-w-[450px] text-gray-900 dark:text-white'
                  onKeyDown={handleAddTopic}
                  setTags={(NewTopics) => {
                    //setAdjectives(newTags);
                    setTopics(NewTopics as [string, ...string[]]);
                  }} 
                />
              {/*<div className="flex flex-wrap gap-2 p-2 pointer-events-none">
                {topics.map((topic) => (
                  <div
                    key={topic}
                    className="bg-muted/50 text-sm px-2 py-0 rounded-md flex items-center pointer-events-auto text-gray-900 dark:text-white"
                  >
                    {topic}
                    <button onClick={() => handleRemoveTopic(topic)} className="ml-2 hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Textarea
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={handleAddTopic}
                className="pl-2 text-gray-900 dark:text-white hidden"
                placeholder="add topic..."
                style={{
                  paddingLeft: topics.length ? `0.5rem` : "0.75rem",
                  paddingTop: topics.length ? "0.3rem" : "0.5rem",
                }}
              />*/}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-white text-lg font-semibold">Adjectives</Label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                Words that describe the character's traits and personality, used for generating responses with
                consistent tone. Can be used in "Mad Libs" style content generation.
              </p>
            </div>
            <div className="relative">
            <TagInput
                  {...adjectives}
                  placeholder="Add adjective..."
                  tags={adjectives}
                  className='sm:min-w-[450px] text-gray-900 dark:text-white'
                  onKeyDown={handleAddAdjective}
                  setTags={(NewAdjectives) => {
                    //setAdjectives(newTags);
                    setAdjectives(NewAdjectives as [string, ...string[]]);
                  }} 
                />
              {/*<div className="flex flex-wrap gap-2 p-2 pointer-events-none">
                {adjectives.map((adjective) => (
                  <div
                    key={adjective}
                    className="bg-muted/50 text-sm px-2 py-0 rounded-md flex items-center pointer-events-auto text-gray-900 dark:text-white"
                  >
                    {adjective}
                    <button
                      onClick={() => handleRemoveAdjective(adjective)}
                      className="ml-2 hover:text-primary-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Textarea
                value={newAdjective}
                onChange={(e) => setNewAdjective(e.target.value)}
                onKeyDown={handleAddAdjective}
                className="pl-2 text-gray-900 dark:text-white hidden"
                placeholder="add adjective..."
                style={{
                  lineHeight: "0.5",
                  paddingLeft: adjectives.length ? `0.5rem` : "0.75rem",
                  paddingTop: adjectives.length ? "0.3rem" : "0.5rem",
                }}
              />*/}
            </div>
          </div>

          <Button type="submit" className="w-full bg-yellow-300 hover:bg-yellow-500 text-black mt-6">Continue to Settings</Button>
        </div>
        </form>
      </div>
    </div>
  )
}