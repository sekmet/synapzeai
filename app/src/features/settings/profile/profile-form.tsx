import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { z } from 'zod'
import { /*useFieldArray,*/ useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface UserData {
  id: string
  email: string
  verified: boolean
  createdAt: string
  updatedAt: string
  lastLogin: string
  hasAcceptedTerms: boolean
  farcaster?: {
    bio: string
    displayName: string
    fid: string
    ownerAddress: string
    pfp: string
    username: string
  }
  linkedAccounts: Array<{
    type: string
    address: string
    bio?: string
    username?: string
  }>
  wallets: any[]
}
//import { cn } from '@/lib/utils'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/stores/authStore'

// API function to send email verification
const sendEmailVerification = async (id: string, email: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/auth/verify-email`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      email
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send verification email')
  }

  return response.json()
}

// API function to update user profile
const updateUserProfile = async (data: ProfileFormValues & { id: string }) => {
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/users/${data.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      bio: data.bio,
      linkedAccounts: data.urls?.map(url => ({
        type: 'url',
        address: url.value
      })),
      hasAcceptedTerms: true,
      verified: true,
      updatedAt: new Date().toISOString()
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to update profile')
  }

  return response.json()
}

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z
    .string({
      required_error: 'Please verify your email address.',
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Fetch user data from API
const fetchUserProfile = async (userId: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/users/${userId}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
};

// Default values when no data is loaded
let defaultValues: Partial<ProfileFormValues> = {
  username: '',
  email: '',
  bio: '',
  urls: [],
}

export default function ProfileForm({ initialData }: { initialData?: ProfileFormValues }) {
  const onboarding = Cookies.get('synapze:onboarding') !== 'false'
  const { setOnboarding, getUser } = useAuthStore((state) => state)
  const queryClient = useQueryClient()
  const [verifyEmailisLoading, setVerifyEmailisLoading] = useState(false)

  if (initialData) {
    defaultValues = initialData
  }
  
  // Fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user', getUser()?.id],
    queryFn: () => fetchUserProfile(getUser()?.id ?? '') as unknown as UserData,
    enabled: true,
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: userData ? {
      username: userData.farcaster?.username || '',
      email: userData.email || '',
      bio: userData.farcaster?.bio || '',
      urls: userData.linkedAccounts
        ?.filter((account: any) => account.type === 'url')
        ?.map((account: any) => ({ value: account.address })) || []
    } : defaultValues,
    mode: 'onChange',
  })

  // Update form values when user data is loaded
  useEffect(() => {
    if (userData) {
      form.reset({
        username: userData.farcaster?.username || '',
        email: userData.email || '',
        bio: userData.farcaster?.bio || '',
        urls: userData.linkedAccounts
          ?.filter((account: any) => account.type === 'url')
          ?.map((account: any) => ({ value: account.address })) || []
      })
    }
    if (userData?.verified && onboarding) {
      setOnboarding({
        currentStep: 2,
        completed: false
      })
    }
    //console.log('USER STORE', user)
    //console.log(userData)
  }, [userData, form])

  /*const { fields, append } = useFieldArray<ProfileFormValues>({
    control: form.control,
    name: "urls",
  })*/

  const verifyUserEmail = async (id: string, email: string) => {

    const response = await sendEmailVerification(id, email);
    return response;
  }

  const verifyEmailMutation = useMutation<
    { success: boolean; id: string; message: string; description: string; },
    Error,
    { id: string; email: string }
  >({
    mutationFn: ({ id, email }) => verifyUserEmail(id, email),
    onSuccess: (data) => {
      toast({
        title: data.message ?? 'Verification Email Sent',
        description: data.description ?? 'Please check your email to verify your account.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send verification email. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ProfileFormValues) => updateUserProfile({ ...data, id: userData?.id || '' }),
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({queryKey: ['user', userData?.id]})

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['user', userData?.id])

      // Optimistically update to the new value
      queryClient.setQueryData(['user', userData?.id], (old: any) => ({
        ...old,
        ...newData,
      }))

      return { previousData }
    },
    onError: (_err: Error, _newData: ProfileFormValues, previousData) => {
      // Roll back to the previous value if there's an error
      queryClient.setQueryData(['user', userData?.id], previousData)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      })
      // Invalidate and refetch
      queryClient.invalidateQueries({queryKey: ['user', userData?.id]})
    },
  })

  function onSubmit(data: ProfileFormValues) {
    if (!userData?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      })
      return
    }

    mutation.mutate(data)
  }

  function onVerifyEmail(id: string, email: string) {
    if (!email || !id) {
      toast({
        title: 'Error',
        description: 'Please enter an email address.',
        variant: 'destructive',
      })
      return
    }
    setVerifyEmailisLoading(true)
    verifyEmailMutation.mutate({ id, email })
    setVerifyEmailisLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
      {isLoading || verifyEmailisLoading ? (
      <p>Loading...</p>
    ) : null}

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Your username' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className='items-start gap-2 grid grid-cols-1 sm:grid-cols-3'>
              <div className='w-full col-span-2'>
              <Input type="email" onChange={field.onChange} defaultValue={field.value} placeholder="Your email" />
              </div>
              <div className='w-full justify-end'>
              <Button 
              type="button" 
              disabled={!field.value || verifyEmailisLoading} 
              onClick={() => onVerifyEmail(`${userData?.id}`, field.value)}
              className='text-gray-200 bg-orange-400 hover:bg-orange-600 hover:text-white'>
                {verifyEmailisLoading ? 'Sending...' : 'Verify Email'}
              </Button>
              </div>
              </div>
              {/*<Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='m@example.com'>m@example.com</SelectItem>
                  <SelectItem value='m@google.com'>m@google.com</SelectItem>
                  <SelectItem value='m@support.com'>m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link to='/'>email settings</Link>.
              </FormDescription>*/}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us a little bit about yourself'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*<div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => append({ value: '' })}
          >
            Add URL
          </Button>
        </div>*/}
        <Button type='submit' variant={'default'} disabled={isLoading}>Update profile</Button>
      </form>
    </Form>
  )
}
