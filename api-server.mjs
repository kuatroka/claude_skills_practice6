#!/usr/bin/env node

/**
 * Simple API server to expose Trailbase database via HTTP
 * This is a WORKAROUND for Trailbase Record API not being properly configured
 *
 * Once Trailbase Record API is fixed, this can be removed and
 * the TanStack DB collection will work directly with Trailbase
 */

import DatabaseConstructor from 'better-sqlite3'
import http from 'http'
import url from 'url'

const DB_PATH = './traildepot/data/main.db'
const db = new DatabaseConstructor(DB_PATH)
const PORT = 3001

console.log('[API SERVER] Starting API server on port 3001...')
console.log('[API SERVER] Database:', DB_PATH)

// Helper function to parse JSON body
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

// Helper to send JSON response
function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(data))
}

// CORS preflight
function handleCORS(req, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  })
  res.end()
}

// API endpoints
const routes = {
  // GET /api/prompts - List all prompts
  'GET /api/prompts': (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM prompts ORDER BY created_at DESC')
      const records = stmt.all()
      sendJSON(res, 200, { records })
    } catch (err) {
      console.error('[API] Error listing prompts:', err)
      sendJSON(res, 500, { error: err.message })
    }
  },

  // POST /api/prompts - Create a new prompt
  'POST /api/prompts': async (req, res) => {
    try {
      const body = await parseBody(req)
      const { id, name, text, created_at, updated_at } = body

      if (!id || !name || !text) {
        return sendJSON(res, 400, { error: 'Missing required fields: id, name, text' })
      }

      const stmt = db.prepare(`
        INSERT INTO prompts (id, name, text, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `)
      stmt.run(id, name, text, created_at || Date.now(), updated_at || Date.now())

      sendJSON(res, 201, { id, name, text, created_at, updated_at })
    } catch (err) {
      console.error('[API] Error creating prompt:', err)
      sendJSON(res, 500, { error: err.message })
    }
  },

  // PUT /api/prompts/:id - Update a prompt
  'PUT /api/prompts/:id': async (req, res, params) => {
    try {
      const { id } = params
      const body = await parseBody(req)

      const stmt = db.prepare(`
        UPDATE prompts
        SET name = COALESCE(?, name),
            text = COALESCE(?, text),
            updated_at = ?
        WHERE id = ?
      `)
      stmt.run(body.name || null, body.text || null, Date.now(), id)

      const row = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id)
      if (!row) {
        return sendJSON(res, 404, { error: 'Prompt not found' })
      }

      sendJSON(res, 200, row)
    } catch (err) {
      console.error('[API] Error updating prompt:', err)
      sendJSON(res, 500, { error: err.message })
    }
  },

  // DELETE /api/prompts/:id - Delete a prompt
  'DELETE /api/prompts/:id': (req, res, params) => {
    try {
      const { id } = params
      const stmt = db.prepare('DELETE FROM prompts WHERE id = ?')
      stmt.run(id)
      sendJSON(res, 204, null)
    } catch (err) {
      console.error('[API] Error deleting prompt:', err)
      sendJSON(res, 500, { error: err.message })
    }
  }
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCORS(req, res)
  }

  // Find matching route
  for (const [route, handler] of Object.entries(routes)) {
    const [method, path] = route.split(' ')

    // Simple path matching with :param support
    const pathRegex = path
      .replace(/:[^/]+/g, '([^/]+)')
      .split('/')
      .filter(Boolean)
    const pathnameSegments = pathname.split('/').filter(Boolean)

    if (req.method === method && pathRegex.length === pathnameSegments.length) {
      let match = true
      const params = {}

      for (let i = 0; i < pathRegex.length; i++) {
        if (pathRegex[i].match(/^\(/)) {
          // Parameter - extract param name from original path
          const paramName = path.split('/')[i + 1].substring(1)
          params[paramName] = pathnameSegments[i]
        } else if (pathRegex[i] !== pathnameSegments[i]) {
          match = false
          break
        }
      }

      if (match) {
        return handler(req, res, params)
      }
    }
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  console.log(`[API SERVER] ✓ Server listening on http://localhost:${PORT}`)
  console.log('[API SERVER] Available endpoints:')
  console.log('  GET  /api/prompts')
  console.log('  POST /api/prompts')
  console.log('  PUT  /api/prompts/:id')
  console.log('  DELETE /api/prompts/:id')
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('[API SERVER] Shutting down...')
  db.close()
  server.close(() => process.exit(0))
})
