// Test the actual RecordApi methods
import { initClient } from 'trailbase'

console.log('[TEST] Testing RecordApi methods...')

const client = initClient('http://localhost:4000')
const recordApi = client.records('prompts')

try {
  console.log('[TEST] Calling recordApi.list()...')
  const result = await recordApi.list()
  console.log('[TEST] list() result:', result)
  console.log('[TEST] Records count:', result.records?.length || 0)
  if (result.records && result.records.length > 0) {
    console.log('[TEST] First record:', result.records[0])
  }
} catch (err) {
  console.error('[TEST] Error calling list():', err.message)
  console.error('[TEST] Full error:', err)
}

try {
  console.log('')
  console.log('[TEST] Calling recordApi.create()...')
  const newRecord = {
    id: 'test-' + Date.now(),
    name: 'Test from RecordAPI',
    text: 'This is a test using RecordApi.create()',
    created_at: Date.now(),
    updated_at: Date.now()
  }
  const created = await recordApi.create(newRecord)
  console.log('[TEST] create() result:', created)
} catch (err) {
  console.error('[TEST] Error calling create():', err.message)
  console.error('[TEST] Full error:', err)
}
