# Prompt Library App - Implementation Plan

## Overview
A prompt library app with Trailbase backend, TanStack DB sync for local-first data, and FTS5 full-text search.

## Architecture
**Trailbase + TanStack DB sync** (local-first with real-time sync)

```
prompt-library/
├── src/
│   ├── db/
│   │   └── collections.ts      # TanStack DB collections with Trailbase
│   ├── components/
│   │   ├── SearchInput.tsx     # Debounced search
│   │   ├── PromptCard.tsx      # Display with copy/edit/delete
│   │   ├── PromptForm.tsx      # Create/edit modal
│   │   └── PromptList.tsx      # Grid of prompts
│   ├── hooks/
│   │   ├── usePrompts.ts       # useLiveQuery for prompts
│   │   └── useSearch.ts        # FTS5 search hook
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── traildepot/
│   ├── migrations/
│   │   ├── U1768434707__create_prompts.sql
│   │   └── U1768434708__create_fts5.sql
│   └── config.textproto
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Tech Stack
- **Backend**: Trailbase (SQLite + Record API + real-time subscriptions)
- **Frontend**: React 19, TanStack DB
- **Sync**: @tanstack/trailbase-db-collection (local-first sync)
- **Styling**: Tailwind CSS 4
- **Build**: Vite, Bun

## Database Schema

### U1768434707__create_prompts.sql
```sql
CREATE TABLE IF NOT EXISTS prompts (
    id BLOB PRIMARY KEY NOT NULL CHECK(is_uuid_v7(id)) DEFAULT (uuid_v7()),
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
) STRICT;

CREATE INDEX IF NOT EXISTS idx_prompts_updated ON prompts(updated_at DESC);
```

### U1768434708__create_fts5.sql
```sql
-- FTS5 virtual table for instant full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
    name,
    text,
    content='prompts',
    content_rowid='rowid',
    tokenize='porter unicode61',
    prefix='2 3 4'
);

-- Auto-sync triggers
CREATE TRIGGER IF NOT EXISTS prompts_ai AFTER INSERT ON prompts BEGIN
    INSERT INTO prompts_fts(rowid, name, text) VALUES (NEW.rowid, NEW.name, NEW.text);
END;

CREATE TRIGGER IF NOT EXISTS prompts_ad AFTER DELETE ON prompts BEGIN
    INSERT INTO prompts_fts(prompts_fts, rowid, name, text) VALUES ('delete', OLD.rowid, OLD.name, OLD.text);
END;

CREATE TRIGGER IF NOT EXISTS prompts_au AFTER UPDATE ON prompts BEGIN
    INSERT INTO prompts_fts(prompts_fts, rowid, name, text) VALUES ('delete', OLD.rowid, OLD.name, OLD.text);
    INSERT INTO prompts_fts(rowid, name, text) VALUES (NEW.rowid, NEW.name, NEW.text);
END;
```

## TanStack DB Collection Setup

```typescript
// src/db/collections.ts
import { createCollection } from '@tanstack/react-db'
import { trailBaseCollectionOptions } from '@tanstack/trailbase-db-collection'
import { initClient } from 'trailbase'

// Use relative URL to go through Vite proxy (avoids CORS issues)
const client = initClient('')

export type SelectPrompt = {
  id: string
  name: string
  text: string
  created_at: number
  updated_at: number
}

export type Prompt = {
  id: string
  name: string
  text: string
  created_at: Date
  updated_at: Date
}

export const promptsCollection = createCollection(
  trailBaseCollectionOptions<Prompt, SelectPrompt, string>({
    id: 'prompts',
    recordApi: client.records('prompts'),
    getKey: (item) => item.id,
    parse: {
      created_at: (ts: number) => new Date(ts * 1000),
      updated_at: (ts: number) => new Date(ts * 1000),
    },
    serialize: {
      created_at: (date: Date) => Math.floor(date.valueOf() / 1000),
      updated_at: (date: Date) => Math.floor(date.valueOf() / 1000),
    },
  })
)
```

## Search Implementation (Client-side)

Using TanStack DB's query builder with `useLiveQuery`:

```typescript
// src/hooks/useSearch.ts
import { useLiveQuery, or, ilike } from '@tanstack/react-db'
import { promptsCollection, type Prompt } from '../db/collections'

export function useSearch(searchTerm: string) {
  const term = searchTerm.trim()

  const { data, isLoading } = useLiveQuery(
    (q) => {
      let query = q.from({ prompt: promptsCollection })

      if (term) {
        const pattern = `%${term}%`
        query = query.where(({ prompt }) =>
          or(
            ilike(prompt.name, pattern),
            ilike(prompt.text, pattern)
          )
        )
      }

      return query.orderBy(({ prompt }) => prompt.updated_at, 'desc')
    },
    [term]
  )

  return {
    prompts: (data ?? []) as Prompt[],
    isLoading,
  }
}
```

## Implementation Phases

### Phase 0: Prerequisites
1. Install Trailbase CLI: `curl -sSL https://trailbase.io/install.sh | bash`
2. Verify installation: `trail --version`

### Phase 1: Project Setup
1. Initialize project with `bun init`
2. Install dependencies
3. Configure Vite with React + Tailwind + proxy to Trailbase
4. Set up TypeScript config

### Phase 2: Trailbase Backend
1. Create `traildepot/` folder structure
2. Write migrations for prompts table and FTS5
3. Configure `config.textproto` with prompts Record API
4. Enable subscriptions via admin UI
5. Start Trailbase and verify migrations applied

### Phase 3: TanStack DB Integration
1. Create `src/db/collections.ts` with promptsCollection
2. Set up Trailbase client with Vite proxy
3. Configure parse/serialize for timestamps
4. Use UUIDv7 for client-side ID generation

### Phase 4: React Components
1. Create `SearchInput.tsx` with 200ms debounce
2. Create `PromptCard.tsx` with copy/edit/delete
3. Create `PromptForm.tsx` modal for create/edit
4. Create `PromptList.tsx` grid layout
5. Wire up `App.tsx` with state management

### Phase 5: Search & Polish
1. Implement `useSearch` hook with `ilike` and `or` query builders
2. Add 200ms debounce to search input
3. Add loading states and empty state UI

## Verification Plan
1. Start Trailbase: `trail run` and check migrations applied in logs
2. Start frontend: `bun run dev`
3. Browser testing:
   - Create a new prompt → verify it appears in list
   - Edit prompt → verify changes persist
   - Search for prompt → verify instant results
   - Copy prompt → verify clipboard
   - Delete prompt → verify removal with confirmation
4. Check Trailbase logs for any Record API errors
5. Test real-time sync: Open two browser tabs, create prompt in one, verify it appears in other
