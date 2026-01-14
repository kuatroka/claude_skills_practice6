import { initClient } from 'trailbase'

const client = initClient('http://localhost:4000')

// Try to create an admin token
try {
  console.log('[VERIFY] Client initialized:', client ? 'yes' : 'no')
  console.log('[VERIFY] Attempting to list users...')
  
  // Try to access user data
  const userApi = client.records('_user')
  console.log('[VERIFY] _user RecordApi:', userApi ? 'created' : 'failed')
  
} catch (err) {
  console.error('[VERIFY] Error:', err.message)
}
