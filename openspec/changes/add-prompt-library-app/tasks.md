# Tasks: Add Prompt Library Application

Implementation checklist organized by phases. Each task is small, verifiable, and delivers user-visible progress.

## Phase 1: Trailbase Backend Foundation

- [ ] 1.1 Install Trailbase CLI (`brew install trailbase` or download)
- [ ] 1.2 Initialize Trailbase project: `trailbase init traildepot`
- [ ] 1.3 Create database schema migration: `traildepot/migrations/001_create_prompts.sql`
  - [ ] Create `prompts` table (id, name, text, created_at, updated_at)
  - [ ] Create index on `created_at DESC`
  - [ ] Test: `sqlite3 traildepot/data/trails.db "SELECT * FROM prompts LIMIT 1"`
- [ ] 1.4 Create FTS5 migration: `traildepot/migrations/002_create_fts5.sql`
  - [ ] Create `prompts_fts` virtual table with optimizations
  - [ ] Create auto-sync triggers (INSERT, UPDATE, DELETE)
  - [ ] Set automerge=8 for read-heavy workload
  - [ ] Test: Verify FTS5 queries return results in <20ms
- [ ] 1.5 Configure Trailbase Record API: `traildepot/config.textproto`
  - [ ] Add Record API for prompts table
  - [ ] Enable subscriptions for real-time sync
  - [ ] Set server address to localhost:4000
  - [ ] Test: Verify Record API accessible at http://localhost:4000/api/records/v1/prompts

## Phase 2: Custom FTS5 Search API

- [ ] 2.1 Create search endpoint source: `traildepot/wasm-src/search-api.ts`
  - [ ] Implement handler for GET /api/search/prompts?q=<query>
  - [ ] Handle empty query (return all prompts)
  - [ ] Implement FTS5 MATCH query with rank ordering
  - [ ] Return results as JSON
- [ ] 2.2 Configure search API in Trailbase config: `traildepot/config.textproto`
  - [ ] Add HTTP handler for /api/search/prompts
  - [ ] Point to WASM module location
- [ ] 2.3 Build and test search endpoint
  - [ ] Run WASM build: `cd traildepot/wasm-src && bun run build`
  - [ ] Copy WASM module to `traildepot/wasm/search-api.wasm`
  - [ ] Test: Verify search returns results in <20ms with curl/Postman

## Phase 3: React Frontend Foundation

- [ ] 3.1 Create React + Vite project with Bun
  - [ ] Run: `bun create vite frontend --template react-ts`
  - [ ] Install dependencies: `cd frontend && bun install`
  - [ ] Verify Vite dev server starts: `bun run dev`
- [ ] 3.2 Install TanStack and Trailbase dependencies
  - [ ] `bun add @tanstack/db @tanstack/react-db @tanstack/trailbase-db-collection trailbase lucide-react`
  - [ ] `bun add -D tailwindcss autoprefixer postcss @tailwindcss/vite`
- [ ] 3.3 Configure Vite proxy: `frontend/vite.config.ts`
  - [ ] Add proxy for `/api/` to http://localhost:4000
  - [ ] Test: Verify API requests forward to backend
- [ ] 3.4 Set up TanStack DB collection: `frontend/src/db/collections.ts`
  - [ ] Initialize Trailbase client
  - [ ] Create `promptsCollection` with trailBaseCollectionOptions
  - [ ] Define Prompt interface
  - [ ] Test: Verify collection connects to backend
- [ ] 3.5 Configure TailwindCSS
  - [ ] Create `tailwind.config.ts`
  - [ ] Create `postcss.config.ts`
  - [ ] Create `src/index.css` with @tailwind directives
  - [ ] Test: Verify styles load

## Phase 4: React Components

- [ ] 4.1 Create SearchBar component: `frontend/src/components/SearchBar.tsx`
  - [ ] Input field with placeholder "Search prompts..."
  - [ ] Pass value and onChange props
  - [ ] Test: Component renders and accepts input
- [ ] 4.2 Create PromptCard component: `frontend/src/components/PromptCard.tsx`
  - [ ] Display prompt name and text
  - [ ] Implement copy button (navigator.clipboard)
  - [ ] Implement edit button
  - [ ] Implement delete button
  - [ ] Show "Copied!" feedback on success
  - [ ] Test: Copy works, buttons trigger callbacks
- [ ] 4.3 Create PromptForm component: `frontend/src/components/PromptForm.tsx`
  - [ ] Form for creating new prompts
  - [ ] Form for editing existing prompts
  - [ ] Name input + Text textarea
  - [ ] Submit and cancel buttons
  - [ ] Call `promptsCollection.insert()` or `update()`
  - [ ] Close modal on success
  - [ ] Test: Form submission creates/updates prompts
- [ ] 4.4 Create PromptList component: `frontend/src/components/PromptList.tsx`
  - [ ] Use `useLiveQuery` for browsing (no search)
  - [ ] Fetch FTS5 search results when searching
  - [ ] Display list of PromptCards
  - [ ] Handle loading and empty states
  - [ ] Debounce search queries (100ms)
  - [ ] Test: Live updates on CRUD, search returns correct results
- [ ] 4.5 Create main App component: `frontend/src/App.tsx`
  - [ ] Combine SearchBar, PromptList, PromptForm
  - [ ] Manage form open/close state
  - [ ] Pass callbacks between components
  - [ ] Wrap in DBProvider
  - [ ] Test: Full UI flow works
- [ ] 4.6 Create utility functions: `frontend/src/lib/utils.ts`
  - [ ] `copyToClipboard()` using navigator.clipboard
  - [ ] `formatDate()` for timestamp display
  - [ ] Test: Functions work as expected

## Phase 5: Integration & Testing

- [ ] 5.1 Start backend and verify connectivity
  - [ ] Terminal 1: `cd traildepot && trailbase run`
  - [ ] Verify server accessible at http://localhost:4000
  - [ ] Check Record API working
  - [ ] Check search endpoint responding
- [ ] 5.2 Start frontend dev server
  - [ ] Terminal 2: `cd frontend && bun run dev`
  - [ ] Verify app accessible at http://localhost:5173
  - [ ] Check for console errors
- [ ] 5.3 Test CRUD operations
  - [ ] Create a new prompt
  - [ ] Verify prompt appears in list
  - [ ] Edit the prompt
  - [ ] Verify updates in real-time
  - [ ] Delete the prompt
  - [ ] Verify removal from list
- [ ] 5.4 Test real-time sync
  - [ ] Open app in two browser tabs
  - [ ] Create prompt in tab 1
  - [ ] Verify it appears in tab 2 within <100ms
  - [ ] Edit in tab 2
  - [ ] Verify updates in tab 1
- [ ] 5.5 Test search functionality
  - [ ] Create 5+ prompts with different names/text
  - [ ] Search for prompt names
  - [ ] Search for text within prompts
  - [ ] Verify results appear in <20ms (measure with DevTools)
  - [ ] Test prefix search (partial word matching)
- [ ] 5.6 Test copy to clipboard
  - [ ] Click copy button on a prompt
  - [ ] Paste in text editor to verify content
  - [ ] Verify "Copied!" feedback shows

## Phase 6: Performance Optimization & Finalization

- [ ] 6.1 Optimize FTS5 index
  - [ ] Load 1000+ test prompts
  - [ ] Run optimization: `INSERT INTO prompts_fts(prompts_fts) VALUES('optimize')`
  - [ ] Verify search still <20ms with large dataset
- [ ] 6.2 Performance profiling
  - [ ] Profile search latency with 10k prompts (if available)
  - [ ] Check index size: `SELECT page_count * page_size FROM pragma_page_count(), pragma_page_size()`
  - [ ] Monitor memory usage
- [ ] 6.3 Production build
  - [ ] Build frontend: `bun run build`
  - [ ] Copy dist to traildepot/public/
  - [ ] Verify serving static files
- [ ] 6.4 Documentation
  - [ ] Create README with setup instructions
  - [ ] Document deployment steps
  - [ ] Add performance benchmarks to openspec/project.md
- [ ] 6.5 Final verification
  - [ ] All CRUD operations work
  - [ ] Real-time sync works across tabs
  - [ ] Search <20ms performance confirmed
  - [ ] Copy to clipboard works
  - [ ] No console errors
  - [ ] No type errors: `tsc --noEmit`

## Dependencies & Parallelization

**Sequential** (must complete in order):
1. Phases 1-2 (Backend setup must complete before frontend can connect)
2. Phases 3-4 (Frontend setup before components)

**Can parallelize within phases**:
- Phase 4 components can be developed in parallel
- Phase 5 testing can be split across CRUD, sync, search

**Estimated effort**:
- Phase 1-2: 2-3 hours (backend setup + FTS5 optimization)
- Phase 3: 1 hour (React + dependencies)
- Phase 4: 2-3 hours (component implementation)
- Phase 5: 1-2 hours (integration + testing)
- Phase 6: 1 hour (optimization + docs)

**Total**: 7-10 hours for complete implementation
