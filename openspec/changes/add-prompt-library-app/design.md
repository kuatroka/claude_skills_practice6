# Design: Prompt Library Application

## Context

Users need to manage and search through reusable prompts efficiently. The solution must:
- Support large prompt collections (10,000+ prompts)
- Deliver instant search results (<20ms)
- Synchronize changes across devices in real-time
- Provide a straightforward UI for CRUD operations

The architecture separates concerns: TanStack DB handles real-time sync and live queries, while SQLite FTS5 handles ultra-fast full-text search. This hybrid approach leverages each technology's strengths.

## Goals

- Implement fast search (<20ms) using SQLite FTS5 with optimizations
- Enable real-time sync via TanStack DB and Trailbase subscriptions
- Create minimal, straightforward UI components
- Support copying prompt text to clipboard
- Type-safe frontend/backend communication

## Non-Goals

- Advanced prompt versioning or collaboration features
- Analytics or usage tracking
- Advanced markdown support
- Mobile app (web-only initially)

## Decisions

### 1. Trailbase + SQLite Backend
**What**: Use Trailbase as single-executable backend with SQLite database.
**Why**:
- Single binary deployment (no dependency management)
- Built-in Record API for CRUD with subscriptions
- WebAssembly runtime for custom endpoints
- SQLite with FTS5 support for ultra-fast search

**Alternatives considered**:
- Firebase: Too expensive, overkill for this use case
- Self-hosted Node.js: More moving parts, dependency management burden
- Pure client-side (SQL.js): No real-time sync across devices

### 2. TanStack DB for Sync Layer
**What**: Use TanStack DB collections with Trailbase integration for real-time data sync and live queries.
**Why**:
- Reactive collections automatically update on data changes
- Built-in optimistic updates with automatic rollback
- Type-safe queries with differential dataflow
- Direct Trailbase integration via @tanstack/trailbase-db-collection

**Alternatives considered**:
- Direct REST API polling: Manual state management, no reactivity
- ElectricSQL: Adds extra dependency, more setup complexity

### 3. SQLite FTS5 with External Content Table
**What**: Create external content FTS5 table with auto-sync triggers for search.
**Why**:
- Immediate <20ms search response on 10k+ prompts
- External content table keeps data normalized
- Auto-sync triggers eliminate manual index management
- Smaller index size with detail='column' option

**Schema decisions**:
- `prefix='2 3'`: Enables fast prefix matching for as-you-type search
- `detail='column'`: Reduces index by 50%+, sufficient without NEAR queries
- `tokenize='porter ascii'`: Balances search quality with performance
- `automerge=8`: Optimized for read-heavy workload

### 4. Hybrid Search Strategy
**What**: Use TanStack `useLiveQuery` for browsing, FTS5 API for searching.
**Why**:
- Normal browsing (no search): Use local IndexedDB + live queries
  - Instant updates via real-time sync
  - No server round-trips
- Search mode (user entering query): Use FTS5 custom endpoint
  - <20ms response time for full-text search
  - Server-side ranking and relevance

**Query patterns**:
```typescript
// Browsing: real-time, local
useLiveQuery((q) =>
  q.from({ prompt: promptsCollection })
    .orderBy(({ prompt }) => prompt.created_at, 'desc')
)

// Searching: fast, FTS5
fetch(`/api/search/prompts?q=${query}`)
```

### 5. Bun as JavaScript Runtime
**What**: Use Bun for both frontend development and package management.
**Why**:
- Faster dependency installation than npm
- Built-in TypeScript support
- Faster development server startup
- Single binary JavaScript runtime

### 6. React + Vite for Frontend
**What**: Modern React with Vite bundler and TailwindCSS.
**Why**:
- Fast HMR during development
- Minimal build configuration
- TailwindCSS for rapid styling
- React's component model fits prompt management UI

### 7. Clipboard Integration
**What**: Use modern `navigator.clipboard` API.
**Why**:
- Native browser support, no dependencies
- Secure (requires HTTPS in production or localhost)
- Simple one-liner: `await navigator.clipboard.writeText(text)`

## Risks & Trade-offs

| Risk | Mitigation |
|------|-----------|
| FTS5 index corruption | Regular validation and backup procedures; export prompts periodically |
| WebSocket connection loss | Automatic reconnection with exponential backoff; queued mutations |
| Large prompt collections (>100k) | Pagination in search results; monitoring query performance |
| Concurrent edits conflict | CRDT-like resolution via Trailbase; last-write-wins for simplicity |

## Migration Plan

### Phase 1: Backend Foundation
1. Initialize Trailbase project
2. Create database migrations (prompts table + FTS5)
3. Configure Record API for CRUD + subscriptions
4. Test basic data operations

### Phase 2: Custom Search API
1. Create TypeScript search endpoint
2. Compile to WASM module
3. Test FTS5 queries (<20ms verification)
4. Expose via HTTP handler

### Phase 3: Frontend Foundation
1. Bootstrap React + Vite with Bun
2. Configure TanStack DB collection
3. Set up Vite proxy to backend
4. Verify real-time sync

### Phase 4: UI Components
1. Build PromptList with live queries
2. Add PromptCard with copy button
3. Create PromptForm for CRUD
4. Add SearchBar with debounce

### Phase 5: Integration & Testing
1. End-to-end CRUD operations
2. Cross-tab real-time sync verification
3. Search performance profiling (<20ms)
4. Clipboard functionality

### Phase 6: Optimization
1. Run FTS5 optimize after bulk data
2. Tune automerge settings based on workload
3. Monitor index size growth
4. Test with 10k+ prompt collection

## Open Questions

1. Should we support prompt categories or tags? (Out of scope for MVP)
2. Do we need full-text search in update operations? (Yes, triggers keep index in sync)
3. What's the backup strategy? (TBD: daily SQLite exports)
4. Should search use substring matching? (Yes, via `prefix='2 3'`)

## Performance Targets

- Initial page load: <500ms
- CRUD operation response: <100ms (local optimistic update)
- Full sync latency: <200ms
- FTS5 search: <20ms for 10k prompts
- Copy to clipboard: Instant
- Real-time sync across tabs: <100ms

## Deployment Considerations

- Single Trailbase binary on server
- React SPA served as static files from Trailbase `public/` directory
- SQLite database stored locally in `traildepot/data/`
- Daily backups of `trails.db`
- No external service dependencies
