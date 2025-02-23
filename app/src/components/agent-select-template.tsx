import { useState, useEffect } from "react"
import {  Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from "lucide-react";
import { getAvailableTemplates, loadTemplate, saveTemplateState } from '@/lib/templates'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { clsx } from 'clsx'
import { type AgentSettings, type MessageExample, type ListItem } from '@/types/templates'

export default function AgentSelectTemplate() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [settings, setSettings] = useState<AgentSettings>()
    const [modelProvider, setModelProvider] = useState("")
    const [postExamples, setPostExamples] = useState<string[]>([])
    const [topics, setTopics] = useState<string[]>([])
    const [adjectives, setAdjectives] = useState<string[]>([])
    const [bioItems, setBioItems] = useState<ListItem[]>([])
    const [loreItems, setLoreItems] = useState<ListItem[]>([])
    const [knowledgeItems, setKnowledgeItems] = useState<ListItem[]>([])
    const [messageExamples, setMessageExamples] = useState<MessageExample[]>([])
    const [styleAllItems, setStyleAllItems] = useState<ListItem[]>([])
    const [styleChatItems, setStyleChatItems] = useState<ListItem[]>([])
    const [stylePostItems, setStylePostItems] = useState<ListItem[]>([])
  
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
    const [selectedClients, setSelectedClients] = useState<string[]>([])
    const [selectedPlugins, setSelectedPlugins] = useState<string[]>([])


    const templates = getAvailableTemplates()

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
    
          toast({
            title: `🤖 ${template.name} template`,
            description: "Agent template loaded...",
            duration: 1000
          })
        }
      }


  // Effect to save state changes
  useEffect(() => {
    const saveState = async () => {
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
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Select a agent template</h1>
          </div>
  
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white text-lg">ElizaOS Templates</CardTitle>
              <CardDescription>Select a template to get started</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {templates.map((template) => (
                <Button 
                key={template} 
                onClick={() => handleTemplateSelect(template)} 
                variant="outline" 
                className={clsx("h-24 flex flex-col items-center justify-center", name === template && "ring-2 ring-foreground text-muted dark:text-white bg-blue-500")}>
                  {template}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Button
          disabled={!name || !selectedTemplate}
          onClick={() => router.navigate({to:`/agent/new/template/${name}`})}
          className="w-full bg-yellow-300 hover:bg-yellow-500 text-black mt-6">
            Continue to agent configuration
          </Button>
        </div>
        </div>
    )
}