import { Link } from '@tanstack/react-router'
import { useState, KeyboardEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, X, ChevronsUpDown, Check, ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ListItem {
  id: string
  content: string
}

interface MessageExample {
  id: string
  userMessage: string
  assistantMessage: string
}

interface Plugin {
  value: string
  label: string
  category: string
  package: string
  description: string
}

const clients = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "discord", label: "Discord" },
  { value: "slack", label: "Slack" },
  { value: "telegram", label: "Telegram" },
]

const plugins: Plugin[] = [
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
]

export default function AgentConfigForm({ title }: { title: string }) {
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
  const [openClients, setOpenClients] = useState(false)
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [openPlugins, setOpenPlugins] = useState(false)
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([])

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

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic))
  }

  const handleRemoveAdjective = (adjective: string) => {
    setAdjectives(adjectives.filter((a) => a !== adjective))
  }

  const handleAddItem = (section: "bio" | "lore" | "knowledge") => {
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
    }
  }

  const handleRemoveItem = (section: "bio" | "lore" | "knowledge", id: string) => {
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
    }
  }

  const handleUpdateItem = (section: "bio" | "lore" | "knowledge", id: string, content: string) => {
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

  const renderList = (section: "bio" | "lore" | "knowledge", items: ListItem[], description: string) => (
    <div className="space-y-2">
      <p className="text-sm text-gray-900 dark:text-white">{description}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <Textarea
              value={item.content}
              onChange={(e) => handleUpdateItem(section, item.id, e.target.value)}
              className="min-h-[44px] flex-1 bg-muted/50 resize-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => handleRemoveItem(section, item.id)}
            >
              <Trash2 className="h-4 w-4" />
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
                  <p className="text-xs font-medium mb-2 text-gray-900 dark:text-white">C-3PO</p>
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-full space-y-6">
      <Link to='/agent/new'>
        <button className="flex items-center text-yellow-500 dark:text-yellow-400 mb-6 hover:opacity-80">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back
        </button>
      </Link>

        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">{title ?? "Configure your agent"}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Select a template to get started</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4">
            {["C3PO", "Douby", "Trump", "Other"].map((template) => (
              <Button key={template} variant="outline" className="h-24 flex flex-col items-center justify-center">
                {template}
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="name" className="text-gray-900 dark:text-white">Name</Label>
            <Input id="name" placeholder="Enter model name" />
          </div>

          <div className="space-y-4">
            <Label htmlFor="model" className="text-gray-900 dark:text-white">Model provider</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Clients</Label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">Supported client types, such as Discord or X</p>
            </div>
            <Popover open={openClients} onOpenChange={setOpenClients}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClients}
                  className="w-full justify-between"
                >
                  {selectedClients.length === 0
                    ? "Select clients..."
                    : clients
                        .filter((client) => selectedClients.includes(client.value))
                        .map((client) => client.label)
                        .join(", ")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
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
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <Label className="text-gray-900 dark:text-white">Plugins</Label>
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
                  className="w-full justify-between"
                >
                  {selectedPlugins.length === 0
                    ? "Select one or multiple plugins"
                    : plugins
                        .filter((plugin) => selectedPlugins.includes(plugin.value))
                        .map((plugin) => plugin.label)
                        .join(", ")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command className="w-full">
                  <CommandInput placeholder="Search plugins..." />
                  <CommandList>
                    <CommandEmpty>No plugin found.</CommandEmpty>
                    <CommandGroup>
                      {plugins.map((plugin) => (
                        <CommandItem
                          key={plugin.value}
                          onSelect={() => {
                            setSelectedPlugins((prev) =>
                              prev.includes(plugin.value)
                                ? prev.filter((item) => item !== plugin.value)
                                : [...prev, plugin.value],
                            )
                          }}
                          className="flex flex-col items-start py-3"
                        >
                          <div className="flex items-center w-full">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                selectedPlugins.includes(plugin.value) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{plugin.label}</span>
                                <span className="text-xs text-gray-900 dark:text-white px-2 py-0.5 rounded-md bg-muted">
                                  {plugin.category}
                                </span>
                              </div>
                              <div className="text-xs text-gray-900 dark:text-white mt-1">{plugin.package}</div>
                              <div className="text-sm text-gray-900 dark:text-white mt-1">{plugin.description}</div>
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

          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="bio">
              <AccordionTrigger className="text-gray-900 dark:text-white">Bio</AccordionTrigger>
              <AccordionContent>
                {renderList(
                  "bio",
                  bioItems,
                  "Background information for your character. Includes biographical details about the character, either as one complete biography or several statements that vary.",
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lore">
              <AccordionTrigger className="text-gray-900 dark:text-white">Lore</AccordionTrigger>
              <AccordionContent>
                {renderList(
                  "lore",
                  loreItems,
                  "Backstory elements and unique character traits. These help define personality and can be randomly sampled in conversations.",
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="knowledge">
              <AccordionTrigger className="text-gray-900 dark:text-white">
                Knowledge
                <span className="ml-2 text-xs text-gray-900 dark:text-white">Optional</span>
              </AccordionTrigger>
              <AccordionContent>
                {renderList("knowledge", knowledgeItems, "Facts or references to ground the character's responses")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="message-examples">
              <AccordionTrigger className="text-gray-900 dark:text-white">Message examples</AccordionTrigger>
              <AccordionContent>{renderMessageExamples()}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="style">
              <AccordionTrigger className="text-gray-900 dark:text-white">Style</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Accordion type="multiple">
                    <AccordionItem value="chat">
                      <AccordionTrigger className="text-gray-900 dark:text-white">Chat</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="chat-1" />
                            <label htmlFor="chat-1">Formal tone</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="chat-2" />
                            <label htmlFor="chat-2">Casual tone</label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="post">
                      <AccordionTrigger className="text-gray-900 dark:text-white">Post</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="post-1" />
                            <label htmlFor="post-1">Include citations</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="post-2" />
                            <label htmlFor="post-2">Use markdown formatting</label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Topics</Label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                List of subjects the character is interested in or knowledgeable about, used to guide conversations and
                generate relevant content. Helps maintain character consistency.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex flex-wrap gap-2 p-2 pointer-events-none">
                {topics.map((topic) => (
                  <div
                    key={topic}
                    className="bg-muted/50 text-sm px-2 py-0 rounded-md flex items-center pointer-events-auto"
                  >
                    {topic}
                    <button onClick={() => handleRemoveTopic(topic)} className="ml-2 hover:text-primary-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={handleAddTopic}
                className="pl-2"
                placeholder="add topic..."
                style={{
                  paddingLeft: topics.length ? "0.5rem" : "0.75rem",
                  paddingTop: topics.length ? "0.4rem" : "0.5rem",
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Adjectives</Label>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                Words that describe the character's traits and personality, used for generating responses with
                consistent tone. Can be used in "Mad Libs" style content generation.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex flex-wrap gap-2 p-2 pointer-events-none">
                {adjectives.map((adjective) => (
                  <div
                    key={adjective}
                    className="bg-muted/50 text-sm px-2 py-0 rounded-md flex items-center pointer-events-auto"
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
              <Input
                value={newAdjective}
                onChange={(e) => setNewAdjective(e.target.value)}
                onKeyDown={handleAddAdjective}
                className="pl-2"
                placeholder="add adjective..."
                style={{
                  paddingLeft: adjectives.length ? "0.5rem" : "0.5rem",
                  paddingTop: adjectives.length ? "0.4rem" : "0.5rem",
                }}
              />
            </div>
          </div>

          <Button className="w-full bg-yellow-300 hover:bg-yellow-500 text-black">Continue to Settings</Button>
        </div>
      </div>
    </div>
  )
}