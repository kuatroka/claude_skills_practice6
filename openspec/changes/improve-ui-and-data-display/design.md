# Design: Improve UI and Fix Data Display

## Current State Analysis

### Critical Issues
1. **PromptList component sets empty array** (line 27): `const allPrompts: Prompt[] = []`
   - This was a placeholder that was never implemented
   - No actual data loading from TanStack DB collection

2. **TanStack DB integration incomplete**:
   - Trailbase client initializes with `http://localhost:4000`
   - RecordApi created for prompts table
   - But PromptList never queries the collection
   - Reference: [TanStack DB Trailbase Collection Documentation](https://tanstack.com/db/latest/docs/collections/trailbase-collection)

3. **Form submission may not sync**:
   - Collection.insert() call may fail silently
   - No server-side confirmation before reload
   - Database shows 0 prompts after submit

### Root Cause
The data loading in PromptList was stubbed with a TODO comment but never implemented. The component needs to actually query the Trailbase backend through the TanStack DB collection.

## Architecture Decisions

### 1. Data Flow Architecture
```
App (state: searchQuery, showForm)
├── AppLayout (header, sidebar)
│   ├── SearchBar → updates searchQuery
│   └── PromptsTable
│       ├── Loads data from Trailbase on mount
│       ├── Filters by searchQuery
│       └── Displays in table with actions (edit, delete)
├── PromptForm (modal)
│   └── On submit: insert/update in Trailbase + reload table
└── LoginForm (modal, if needed)
    └── Authenticate before showing content
```

### 2. Component Structure

**AppLayout** (New)
- Header with title and "New Prompt" button
- Sidebar with navigation (optional, can be collapsed)
- Main content area
- Responsive design using shadcn/ui

**PromptsTable** (Replaces PromptList)
- Uses shadcn/ui Table component
- Features:
  - Sortable columns (Name, Date)
  - Searchable (client-side filtering)
  - Row actions: Edit, Delete, Copy
  - No-data state when empty
  - Loading state while fetching

**PromptForm** (Improve)
- Uses shadcn/ui Form component
- Add validation with feedback
- Clear error messages if save fails

**LoginForm** (New, Optional)
- Simple email/password form
- Uses shadcn/ui Form component
- Store token in localStorage
- Pass token in all API requests

### 3. Data Loading Strategy

**Reference**: [TanStack DB Trailbase Collection Documentation](https://tanstack.com/db/latest/docs/collections/trailbase-collection)

#### On App Mount
```typescript
// In PromptsTable or parent
useEffect(() => {
  setLoading(true)
  try {
    // Option 1: Direct query to Trailbase
    const response = await fetch('/api/records/v1/prompts', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    setPrompts(data.records)

    // Option 2: Use TanStack DB collection (if working)
    // Follow TanStack DB Trailbase Collection docs:
    // https://tanstack.com/db/latest/docs/collections/trailbase-collection
    // const records = await promptsCollection.subscribe(...)
  } catch (err) {
    setError(`Failed to load: ${err.message}`)
  } finally {
    setLoading(false)
  }
}, [token])
```

#### On Prompt Create/Update
```typescript
// In PromptForm
try {
  const response = await fetch('/api/records/v1/prompts', {
    method: 'POST',
    body: JSON.stringify(newPrompt),
    headers: { 'Authorization': `Bearer ${token}` }
  })

  if (response.ok) {
    // Reload table data
    onSaved()
    showSuccessToast('Prompt saved!')
  } else {
    throw new Error(await response.text())
  }
} catch (err) {
  showErrorToast(err.message)
}
```

### 4. shadcn/ui Component Selection

| Component | Purpose |
|-----------|---------|
| `Button` | Action buttons (New, Edit, Delete, Copy) |
| `Input` | Form inputs, search |
| `Table` | Display prompts in rows/columns |
| `Form` | Prompt creation/editing with validation |
| `Dialog` | Modal for prompt form and login |
| `Card` | Content sections (optional) |
| `Select` | Dropdowns if needed |
| `Toast` | Success/error notifications |
| `Breadcrumb` | Navigation context |
| `Sidebar` | Navigation panel (optional) |

### 5. Authentication Flow

```
1. Check if localStorage has 'auth_token'
2. If not, show LoginForm
3. If yes, show AppLayout with PromptsTable
4. Include token in all API requests
5. If 401, clear token and show LoginForm
```

## Key Design Principles

1. **Simplicity**: Start with minimal viable changes, add complexity only if needed
2. **Visibility**: Every action (create, update, delete) should have user feedback
3. **Consistency**: Use shadcn/ui components throughout for consistent UX
4. **Debugging**: Add error messages that help diagnose issues (database, network, auth)
5. **Type Safety**: Maintain TypeScript throughout

## Migration Path

### Phase 1: Fix Data Persistence (Critical)
- Debug TanStack DB / Trailbase integration
- Add proper error handling and logging
- Verify data actually saves to database

### Phase 2: Install shadcn/ui
- Add shadcn/ui CLI and dependencies
- Configure component output path
- Install base component set

### Phase 3: Build Professional UI
- Create AppLayout component with shadcn/ui
- Create PromptsTable component
- Create LoginForm component
- Replace old components

### Phase 4: Integration and Testing
- Test full CRUD cycle with new UI
- Verify data persistence
- Test search and sorting
- Test authentication flow

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Breaking existing functionality | Test each component in isolation first |
| Incomplete data loading | Add verbose logging and error messages |
| Authentication required by backend | Start with optional auth, add later |
| Large bundle size from shadcn/ui | Use tree-shaking, test bundle size |
| Component style conflicts | Use CSS modules or shadcn/ui's built-in theming |

## Open Questions

1. **Does Trailbase require authentication?**
   - Current code has no auth tokens
   - Should we add a login form or mock authentication?

2. **What's the correct way to use TanStack DB with Trailbase?**
   - Is the current RecordApi initialization correct?
   - Should we use direct fetch() instead?

3. **Should we implement optional features?**
   - Sidebar navigation
   - Breadcrumbs
   - Advanced filtering/sorting

4. **What's the acceptable table size?**
   - Should we implement pagination for 1000+ prompts?
