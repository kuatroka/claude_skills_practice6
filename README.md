# Prompt Library

A local-first prompt library app with Trailbase backend, TanStack DB sync, and instant full-text search.

## Tech Stack

- **Backend**: [Trailbase](https://trailbase.io) (SQLite + Record API + real-time subscriptions)
- **Frontend**: React 19, TanStack DB
- **Sync**: @tanstack/trailbase-db-collection (local-first sync)
- **Styling**: Tailwind CSS 4
- **Build**: Vite, Bun

## Prerequisites

### 1. Install Bun
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Trailbase CLI
```bash
curl -sSL https://trailbase.io/install.sh | bash
```

Verify installation:
```bash
trail --version
```

## Quick Start

### 1. Install dependencies
```bash
bun install
```

### 2. Start Trailbase (Terminal 1)
```bash
trail run
```

On first run, Trailbase will:
- Apply migrations from `traildepot/migrations/`
- Create an admin user with credentials shown in the console
- Start the server on http://localhost:4000

**Save the admin credentials** from the output:
```
Created new admin user:
    email: 'admin@localhost'
    password: '<generated-password>'
```

### 3. Enable Subscriptions (First time only)

1. Open Trailbase Admin: http://localhost:4000/_/admin/
2. Log in with admin credentials
3. Go to **Tables** → **prompts** → **API** button
4. Check **Enable Subscriptions**
5. Click **Update** → **Update** (confirm)

### 4. Start Frontend (Terminal 2)
```bash
bun run dev
```

Frontend runs on http://localhost:5173

## Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Trailbase) | 4000 | http://localhost:4000 |
| Admin UI | 4000 | http://localhost:4000/_/admin/ |

## Available Scripts

```bash
# Development
bun run dev          # Start Vite dev server (port 5173)

# Type checking
bun run typecheck    # Run TypeScript type checker

# Linting
bun run lint         # Lint all files
bun run lint:file    # Lint specific file

# Testing
bun run test         # Run all tests
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── SearchInput.tsx    # Debounced search input
│   │   ├── PromptCard.tsx     # Prompt display with copy/edit/delete
│   │   ├── PromptForm.tsx     # Create/edit modal
│   │   └── PromptList.tsx     # Grid layout
│   ├── db/
│   │   └── collections.ts     # TanStack DB collection with Trailbase
│   ├── hooks/
│   │   ├── useSearch.ts       # Search with ilike queries
│   │   └── useDebounce.ts     # Debounce hook
│   ├── lib/
│   │   └── utils.ts           # UUIDv7 generation, formatDate, copyToClipboard
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── traildepot/
│   ├── migrations/
│   │   ├── U1768434707__create_prompts.sql   # Prompts table
│   │   └── U1768434708__create_fts5.sql      # FTS5 full-text search
│   └── config.textproto                       # Record API config
├── docs/
│   └── plans/
│       └── first-app-plan.md                  # Implementation plan
├── vite.config.ts             # Vite config with proxy to Trailbase
├── tsconfig.json
└── package.json
```

## Database

### Migrations

Migrations are in `traildepot/migrations/` and applied automatically when Trailbase starts.

- **U1768434707__create_prompts.sql**: Creates `prompts` table with UUIDv7 primary key
- **U1768434708__create_fts5.sql**: Creates FTS5 virtual table with auto-sync triggers

### Record API Config

`traildepot/config.textproto` configures the prompts API:
- World-readable (no auth required)
- CRUD operations enabled
- Subscriptions enabled (via admin UI)

### Direct Database Access

```bash
# Connect to SQLite database
sqlite3 traildepot/main.db

# Example queries
.tables
SELECT * FROM prompts;
SELECT * FROM prompts_fts WHERE prompts_fts MATCH 'search term';
```

## API Endpoints

The Vite proxy forwards `/api/*` requests to Trailbase.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/records/v1/prompts` | GET | List all prompts |
| `/api/records/v1/prompts` | POST | Create prompt |
| `/api/records/v1/prompts/:id` | PATCH | Update prompt |
| `/api/records/v1/prompts/:id` | DELETE | Delete prompt |
| `/api/records/v1/prompts/_subscribe` | GET | SSE subscription |

### Example: Create prompt via curl
```bash
curl -X POST http://localhost:4000/api/records/v1/prompts \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Prompt", "text": "This is a test."}'
```

## Features

- **Create prompts**: Click "New Prompt" button
- **Edit prompts**: Click edit icon on prompt card
- **Delete prompts**: Click delete icon (with confirmation)
- **Copy to clipboard**: Click copy icon
- **Search**: Type in search bar (200ms debounce, searches name and text)
- **Real-time sync**: Changes sync across browser tabs

## Troubleshooting

### CORS errors
The Vite proxy handles CORS. Make sure:
- Trailbase is running on port 4000
- Frontend uses relative URLs (not `http://localhost:4000`)

### 403 on subscribe endpoint
Enable subscriptions in Trailbase admin:
1. Go to http://localhost:4000/_/admin/table/
2. Click prompts → API
3. Check "Enable Subscriptions"
4. Click Update

### Migrations not applying
Delete `traildepot/` folder and restart Trailbase to rerun migrations:
```bash
rm -rf traildepot/
trail run
```

### Reset admin password
Delete the vault and restart:
```bash
rm -f traildepot/vault.json
trail run
```
New credentials will be printed to console.

## Development Notes

- **UUIDv7**: Client generates IDs using `uuidv7` package (required by Trailbase)
- **Timestamps**: Stored as Unix seconds, parsed/serialized in collection config
- **Search**: Uses TanStack DB's `ilike` and `or` query builders (client-side)
- **FTS5**: Tables ready for server-side full-text search upgrade
