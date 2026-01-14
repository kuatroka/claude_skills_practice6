import { initClient } from 'trailbase'

console.log('[TEST] Testing RecordApi after config fix...')

const client = initClient('http://localhost:4000')
const recordApi = client.records('prompts')

try {
  console.log('[TEST] Calling recordApi.list()...')
  const result = await recordApi.list()
  console.log('[TEST] ✓ list() SUCCESS!')
  console.log('[TEST] Records count:', result.records?.length || 0)
  if (result.records && result.records.length > 0) {
    console.log('[TEST] First record:', JSON.stringify(result.records[0], null, 2))
  }
} catch (err) {
  console.error('[TEST] ✗ list() failed:', err.message)
}

try {
  console.log('')
  console.log('[TEST] Creating a test record...')
  const newRecord = {
    id: 'test-' + Date.now(),
    name: 'Test from RecordAPI',
    text: 'This is a test using RecordApi.create()',
    created_at: Date.now(),
    updated_at: Date.now()
  }
  const created = await recordApi.create(newRecord)
  console.log('[TEST] ✓ create() SUCCESS!')
  console.log('[TEST] Created record ID:', created.id)
} catch (err) {
  console.error('[TEST] ✗ create() failed:', err.message)
}
