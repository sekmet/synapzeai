import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Log } from '../data/schema'

type LogsDialogType = 'create' | 'update' | 'delete' | 'import'

interface LogsContextType {
  open: LogsDialogType | null
  setOpen: (str: LogsDialogType | null) => void
  currentRow: Log | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Log | null>>
}

const LogsContext = React.createContext<LogsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function LogsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<LogsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Log | null>(null)
  return (
    <LogsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LogsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLogs = () => {
  const logsContext = React.useContext(LogsContext)

  if (!logsContext) {
    throw new Error('useLogs has to be used within <LogsContext>')
  }

  return logsContext
}
