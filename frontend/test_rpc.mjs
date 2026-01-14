// Test if Trailbase has a tRPC or similar RPC interface
const endpoints = [
  '/trpc/records.list',
  '/rpc/records.list',
  '/api/rpc/records.list',
  '/call/records.list',
  '/execute/prompts',
  '/sql',
  '/query'
]

console.log('Testing RPC-style endpoints...')
for (const endpoint of endpoints) {
  const status = await fetch(`http://localhost:4000${endpoint}`, { method: 'POST' })
    .then(r => r.status)
    .catch(() => 'ERR')
  console.log(`${endpoint} → ${status}`)
}
