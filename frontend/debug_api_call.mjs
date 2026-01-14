import { initClient } from 'trailbase'

// Monkey-patch fetch to see what URLs are being called
const originalFetch = globalThis.fetch
globalThis.fetch = (url, options) => {
  console.log('[DEBUG] Fetch called:', {
    url: url.toString(),
    method: options?.method || 'GET',
    headers: options?.headers
  })
  return originalFetch(url, options)
}

const client = initClient('http://localhost:4000')
const recordApi = client.records('prompts')

try {
  await recordApi.list()
} catch (err) {
  console.log('[DEBUG] Error (expected):', err.message)
}
