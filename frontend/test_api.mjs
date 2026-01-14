// Test the Trailbase API from Node.js (same as frontend would)

console.log('[TEST] Testing Trailbase API connection...')

try {
  const response = await fetch('http://localhost:4000/api/records/v1/prompts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  console.log('[TEST] Response status:', response.status)
  const text = await response.text()
  console.log('[TEST] Response body (first 200 chars):', text.substring(0, 200))
  
  if (!response.ok) {
    console.error('[TEST] Error: API returned', response.status)
    const json = await fetch('http://localhost:4000/api/records/v1/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test', text: 'test', id: 'test-' + Date.now() })
    })
    console.log('[TEST] POST response:', json.status)
  }
} catch (error) {
  console.error('[TEST] Error:', error.message)
}
