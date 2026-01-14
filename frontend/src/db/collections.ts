import { createCollection } from '@tanstack/db'
import { trailBaseCollectionOptions } from '@tanstack/trailbase-db-collection'
import type { RecordApi } from 'trailbase'
import { initClient } from 'trailbase'

export interface Prompt {
  id: string
  name: string
  text: string
  created_at: number
  updated_at: number
}

// Initialize Trailbase client and get the RecordApi for prompts
console.log('[COLLECTIONS] Initializing Trailbase client at http://localhost:4000')
const trailbaseClient = initClient('http://localhost:4000')
console.log('[COLLECTIONS] Trailbase client initialized:', trailbaseClient)

const recordApi: RecordApi<Prompt> = trailbaseClient.records<Prompt>('prompts')
console.log('[COLLECTIONS] RecordApi created for prompts table:', recordApi)

// Create the prompts collection with Trailbase integration
console.log('[COLLECTIONS] Creating prompts collection with TanStack DB...')
export const promptsCollection = createCollection<Prompt>(
  trailBaseCollectionOptions<Prompt>({
    recordApi,
    getKey: (item) => item.id,
    parse: {},
    serialize: {},
  })
)
console.log('[COLLECTIONS] Prompts collection created successfully:', promptsCollection)
