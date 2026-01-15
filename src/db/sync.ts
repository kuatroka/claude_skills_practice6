import { client, promptsCollection, type Prompt, type SelectPrompt } from './collections'

/**
 * Fetch data from Trailbase server and sync to local IndexedDB.
 * This runs in the background on app load to ensure local data is fresh.
 *
 * Note: This uses bulkUpdateLocally to handle upserts properly, avoiding
 * duplicates when client and server use different ID formats.
 */
export async function syncFromServer() {
  try {
    // Fetch all prompts from Trailbase
    const response = await client.records('prompts').list()
    const serverRecords = response.records as SelectPrompt[]

    // Transform server data to local format
    const prompts: Prompt[] = serverRecords.map((p) => ({
      id: p.id,
      name: p.name,
      text: p.text,
      created_at: new Date(p.created_at * 1000),
      updated_at: new Date(p.updated_at * 1000),
    }))

    // Bulk insert to local Dexie (will upsert by ID)
    if (prompts.length > 0) {
      await promptsCollection.utils.bulkInsertLocally(prompts)
    }

    console.log(`[sync] Synced ${prompts.length} prompts from server`)
  } catch (error) {
    // Don't throw - we can work with local data if server is unavailable
    console.warn('[sync] Server sync failed, using local data:', error)
  }
}
