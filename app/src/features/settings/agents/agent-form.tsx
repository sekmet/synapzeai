import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const agentFormSchema = z.object({
  delete_agent: z.boolean(),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AgentFormValues> = {
  delete_agent: false,
}

export function AgentForm() {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
  })

  function onSubmit(data: AgentFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='delete_agent'
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <FormLabel className='text-base'>Danger zone</FormLabel>
                <FormDescription>
                  This action cannot be undone. This will permanently delete your
                  agent and remove your data from our servers.
                </FormDescription>
              </div>
              <FormControl>
                <Button 
                className='text-red-600' 
                >Delete this agent</Button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Delete agent</Button>
      </form>
    </Form>
  )
}
