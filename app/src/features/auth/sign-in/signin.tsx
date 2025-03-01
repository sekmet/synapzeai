import SynapzeLogo from '@/assets/logo-synapze.png'
//import { UserAuthForm } from './components/user-auth-form'
import { PrivyAuthLogin } from './components/pirvy-auth-login'

export default function SignIn2() {
  return (
    <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-zinc-900' />

        <div className='relative z-20 flex items-center text-lg font-medium'>
        <img
          src={SynapzeLogo}
          className='relative h-10 w-10 mr-2'
          alt='Synapze'
        />
          Synapze AI Agents
        </div>

        <img
          src={SynapzeLogo}
          className='relative m-auto'
          width={301}
          height={60}
          alt='Synapze'
        />

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Code less. Create more. Effortless AI. Instant Synapze.&rdquo;
            </p>
            <footer className='text-sm'>Synapze AI</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>Login to Synapze</h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email and password below <br />
              to log into your account
            </p>
          </div>
          <PrivyAuthLogin />
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking login, you agree to our{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
