import { createCollection } from '@tanstack/react-db'
import { dexieCollectionOptions } from 'tanstack-dexie-db-collection'
import { initClient } from 'trailbase'

// Trailbase client for backend sync
export const client = initClient('')

// Type for the app (timestamps as Dates)
export type Prompt = {
  id: string
  name: string
  text: string
  created_at: Date
  updated_at: Date
}

// Type from Trailbase (what comes from the server - timestamps as numbers)
export type SelectPrompt = {
  id: string
  name: string
  text: string
  created_at: number
  updated_at: number
}

export const promptsCollection = createCollection(
  dexieCollectionOptions<Prompt>({
    id: 'prompts',
    dbName: 'prompt-library',
    getKey: (item) => item.id,

    // Sync handlers for Trailbase backend
    onInsert: async ({ transaction }) => {
      const prompt = transaction.mutations[0].modified
      const localId = transaction.mutations[0].key

      // Create on server without sending client ID - let Trailbase generate it
      const serverId = await client.records('prompts').create({
        name: prompt.name,
        text: prompt.text,
        created_at: Math.floor(prompt.created_at.valueOf() / 1000),
        updated_at: Math.floor(prompt.updated_at.valueOf() / 1000),
      })

      // If server returned a different ID, update local record
      if (serverId && serverId !== localId) {
        // Delete old local record and insert with server ID
        await promptsCollection.utils.deleteLocally(localId as string | number)
        await promptsCollection.utils.insertLocally({
          ...prompt,
          id: serverId,
        })
      }
    },
    onUpdate: async ({ transaction }) => {
      const { key, modified } = transaction.mutations[0]
      await client.records('prompts').update(key as string, {
        name: modified.name,
        text: modified.text,
        updated_at: Math.floor(modified.updated_at.valueOf() / 1000),
      })
    },
    onDelete: async ({ transaction }) => {
      const key = transaction.mutations[0].key
      await client.records('prompts').delete(key as string)
    },
  })
)
