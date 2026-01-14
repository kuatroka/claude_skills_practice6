// Check what the trailbase package exports
import { initClient } from 'trailbase'

console.log('[INSPECT] Checking trailbase package exports...')
console.log('[INSPECT] initClient:', typeof initClient)

const client = initClient('http://localhost:4000')
console.log('[INSPECT] Client object keys:', Object.keys(client))
console.log('[INSPECT] Client object:', client)

const recordApi = client.records('prompts')
console.log('[INSPECT] RecordApi object keys:', Object.keys(recordApi))
console.log('[INSPECT] RecordApi methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(recordApi)))
console.log('[INSPECT] RecordApi object:', recordApi)
