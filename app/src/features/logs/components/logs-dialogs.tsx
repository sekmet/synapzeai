import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useLogs } from '../context/logs-context'
import { LogsImportDialog } from './logs-import-dialog'
import { LogsMutateDrawer } from './logs-mutate-drawer'

export function LogsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLogs()
  return (
    <>
      <LogsMutateDrawer
        key='log-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <LogsImportDialog
        key='logs-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <LogsMutateDrawer
            key={`log-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='log-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              toast({
                title: 'The following log has been deleted:',
                description: (
                  <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                      {JSON.stringify(currentRow, null, 2)}
                    </code>
                  </pre>
                ),
              })
            }}
            className='max-w-md'
            title={`Delete this log: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a log with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
