# Change: Add Prompt Library Application

## Why

Enable users to build a personal knowledge base of reusable prompts with ultra-fast search and instant synchronization across devices. This solves the problem of manually managing and searching through prompt collections, and provides a foundation for collaborative AI workflows.

## What Changes

- **New Application**: Full-stack prompt library app (Trailbase backend + React frontend)
- **Prompt Management**: Create, read, update, delete prompts (name + text content)
- **Clipboard Integration**: Copy prompt text to clipboard with single click
- **Ultra-Fast Search**: Full-text search on both name and text fields (<20ms response time)
- **Real-Time Sync**: Automatic synchronization across browser tabs and devices using TanStack DB
- **Modern Stack**: React + Vite frontend, Trailbase backend, Bun package manager

## Impact

- **New Capabilities**: prompt-management, full-text-search, clipboard-integration, real-time-sync
- **New Backend**: Trailbase server with SQLite database and FTS5 search
- **New Frontend**: React/Vite application with TanStack DB collection
- **Key Files**:
  - Backend: `traildepot/config.textproto`, `traildepot/migrations/*.sql`, `traildepot/wasm-src/search-api.ts`
  - Frontend: `frontend/src/db/collections.ts`, `frontend/src/components/*.tsx`
  - Config: `openspec/project.md` will be updated with tech stack details

## Technical Priorities

1. **Search Performance**: <20ms FTS5 queries using prefix indexes, column-detail optimization, and automerge tuning
2. **Real-Time Sync**: Automatic cross-device sync via TanStack DB subscriptions
3. **Simplicity First**: Minimal components, straightforward CRUD operations, no over-engineering
4. **Type Safety**: Full TypeScript with Zod validation at API boundaries

## Affected Specs

This change introduces four new capabilities with no modifications to existing specs.
