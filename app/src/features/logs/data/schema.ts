import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const logSchema = z.object({
  id: z.string().optional(),
  log: z.string(),
  status: z.string().optional(),
  label: z.string().optional(),
  priority: z.string().optional(),
})

export type Log = z.infer<typeof logSchema>
