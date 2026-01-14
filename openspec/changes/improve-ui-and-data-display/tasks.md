# Tasks: Improve UI and Fix Data Display

Implementation tasks organized by phase. Each task is small, verifiable, and delivers user-visible progress.

## Phase 1: Debug and Fix Data Persistence (Critical)

- [ ] 1.1 Add console logging to data flow
  - [ ] Log when form submits
  - [ ] Log when insert() is called
  - [ ] Log any errors from collection operations
  - [ ] Add logging to Trailbase client initialization
  - [ ] Test: Check browser console for logs when saving a prompt

- [ ] 1.2 Test database directly
  - [ ] Query database: `sqlite3 traildepot/data/main.db "SELECT * FROM prompts;"`
  - [ ] Check if prompts table is empty after form submission
  - [ ] Verify schema matches expected structure
  - [ ] Test: Database contains saved prompt after manual insert

- [ ] 1.3 Test Trailbase API directly
  - [ ] Test Record API with curl: `curl http://localhost:4000/api/records/v1/prompts`
  - [ ] Check what authentication is required
  - [ ] Get a valid auth token from admin UI if needed
  - [ ] Test: API returns prompts list (even if empty)

- [ ] 1.4 Fix TanStack DB collection initialization
  - [ ] Verify Trailbase client initialization in collections.ts
  - [ ] Check if recordApi is properly configured
  - [ ] Add error handling and logging to collection methods
  - [ ] Consider using direct fetch() if TanStack DB integration is problematic
  - [ ] Test: Collection methods log success/failure

- [ ] 1.5 Implement proper data loading in component
  - [ ] Replace hardcoded `[]` with actual data fetch
  - [ ] Add useEffect to load data on mount
  - [ ] Implement error state and loading state
  - [ ] Add refresh function for manual reload
  - [ ] Test: PromptList loads and displays at least one saved prompt

## Phase 2: Install and Configure shadcn/ui

- [ ] 2.1 Install shadcn/ui CLI and dependencies
  - [ ] Run: `bun add -D @shadcn-ui/cli`
  - [ ] Initialize: `npx shadcn-ui@latest init`
  - [ ] Choose Tailwind CSS as styling system (already installed)
  - [ ] Configure component output path (use src/components/ui)
  - [ ] Test: shadcn-ui CLI is accessible

- [ ] 2.2 Install base shadcn/ui components
  - [ ] Button: `npx shadcn-ui@latest add button`
  - [ ] Input: `npx shadcn-ui@latest add input`
  - [ ] Table: `npx shadcn-ui@latest add table`
  - [ ] Form: `npx shadcn-ui@latest add form`
  - [ ] Dialog: `npx shadcn-ui@latest add dialog`
  - [ ] Toast: `npx shadcn-ui@latest add sonner` (for notifications)
  - [ ] Test: All components are in src/components/ui/

- [ ] 2.3 Add optional components
  - [ ] Card: `npx shadcn-ui@latest add card`
  - [ ] Breadcrumb: `npx shadcn-ui@latest add breadcrumb`
  - [ ] Sidebar: `npx shadcn-ui@latest add sidebar` (if available, else skip)
  - [ ] Test: Components exist and can be imported

## Phase 3: Build Professional UI Components

- [ ] 3.1 Create AppLayout component
  - [ ] File: `src/components/AppLayout.tsx`
  - [ ] Header with title and "New Prompt" button
  - [ ] Main content area (pass children)
  - [ ] Optional sidebar for navigation
  - [ ] Use shadcn/ui Button and Card
  - [ ] Test: Layout renders and button is clickable

- [ ] 3.2 Create PromptsTable component
  - [ ] File: `src/components/PromptsTable.tsx`
  - [ ] Use shadcn/ui Table component
  - [ ] Columns: Name, Text (preview, truncated), Created At, Actions
  - [ ] Action buttons: Edit, Delete, Copy (using lucide icons)
  - [ ] Loading state: "Loading prompts..."
  - [ ] Empty state: "No prompts yet. Create one to get started!"
  - [ ] Searchable: Client-side filter on name and text
  - [ ] Sortable: Click column header to sort
  - [ ] Test: Table displays at least 3 test prompts with all columns

- [ ] 3.3 Create LoginForm component
  - [ ] File: `src/components/LoginForm.tsx`
  - [ ] Email and password inputs
  - [ ] "Sign In" button
  - [ ] Error message display
  - [ ] Loading state during authentication
  - [ ] Use shadcn/ui Form component with validation
  - [ ] On success: Store token in localStorage, call onLoginSuccess
  - [ ] Test: Form submits and shows error/success feedback

- [ ] 3.4 Improve PromptForm component
  - [ ] Use shadcn/ui Form component
  - [ ] Add form validation with error messages
  - [ ] Add loading state during submission
  - [ ] Show success/error toast notifications
  - [ ] Improve styling and spacing
  - [ ] Test: Form validation works, shows feedback on errors

- [ ] 3.5 Create AppShell wrapper
  - [ ] File: `src/components/AppShell.tsx`
  - [ ] Check if user is authenticated (localStorage token)
  - [ ] Show LoginForm if not authenticated
  - [ ] Show AppLayout + main content if authenticated
  - [ ] Handle logout (clear localStorage)
  - [ ] Test: Unauthenticated → LoginForm, Authenticated → AppLayout

## Phase 4: Integrate and Connect Components

- [ ] 4.1 Update App.tsx to use new components
  - [ ] Replace custom SearchBar with shadcn/ui Input in AppLayout header
  - [ ] Replace PromptList with PromptsTable
  - [ ] Wrap layout in AppShell
  - [ ] Pass auth token to all data fetching functions
  - [ ] Remove old PromptCard component (replaced by table rows)
  - [ ] Test: App layout changes and renders new components

- [ ] 4.2 Connect data loading to PromptsTable
  - [ ] useEffect to load prompts on mount
  - [ ] Pass token from authentication
  - [ ] Handle loading and error states
  - [ ] Implement manual refresh button
  - [ ] Test: Table loads and displays prompts from database

- [ ] 4.3 Connect form submission to table refresh
  - [ ] After PromptForm submits, reload PromptsTable data
  - [ ] Show success toast notification
  - [ ] Handle form errors with error toast
  - [ ] Close modal on success
  - [ ] Test: Create → Table updates, Edit → Table updates

- [ ] 4.4 Connect table actions to handlers
  - [ ] Edit button → Open PromptForm with prompt data
  - [ ] Delete button → Show confirmation, delete, refresh table
  - [ ] Copy button → Copy to clipboard, show feedback
  - [ ] Search filters table in real-time
  - [ ] Sorting works on clickable columns
  - [ ] Test: All table actions work correctly

## Phase 5: Testing and Polish

- [ ] 5.1 End-to-end testing
  - [ ] Create a new prompt → Appears in table
  - [ ] Edit prompt → Table updates with new data
  - [ ] Delete prompt → Removed from table
  - [ ] Search filters results correctly
  - [ ] Copy button works and shows feedback
  - [ ] Test: Complete CRUD cycle works

- [ ] 5.2 Verify database persistence
  - [ ] After creating prompt, check database: `sqlite3 traildepot/data/main.db "SELECT COUNT(*) FROM prompts;"`
  - [ ] Verify prompt count increases
  - [ ] Verify data matches what's shown in table
  - [ ] Test: Database actually contains saved data

- [ ] 5.3 Error handling and edge cases
  - [ ] Network error → Show error message in table
  - [ ] Authentication expired → Show login form
  - [ ] Invalid form input → Show validation error
  - [ ] Empty database → Show empty state message
  - [ ] Test: All error states handled gracefully

- [ ] 5.4 Browser testing
  - [ ] Test in Chrome/Firefox/Safari
  - [ ] Test responsive design (mobile, tablet, desktop)
  - [ ] Test keyboard navigation (Tab, Enter, Escape)
  - [ ] Check console for any errors or warnings
  - [ ] Test: No console errors, responsive layout works

- [ ] 5.5 Production build
  - [ ] `bun run build` succeeds with no errors
  - [ ] Bundle size is acceptable
  - [ ] No TypeScript errors: `npx tsc --noEmit`
  - [ ] Test: Build succeeds and size is <500kB gzipped

## Phase 6: Documentation and Cleanup

- [ ] 6.1 Update component documentation
  - [ ] Add JSDoc comments to all new components
  - [ ] Document props and expected behavior
  - [ ] Include usage examples

- [ ] 6.2 Update project README
  - [ ] Document new component structure
  - [ ] Update architecture diagram with new components
  - [ ] Add authentication setup instructions

- [ ] 6.3 Clean up old code
  - [ ] Remove unused PromptCard component (if replaced by table)
  - [ ] Remove SearchBar component (if using table filtering)
  - [ ] Remove old PromptList component
  - [ ] Clean up unused imports

- [ ] 6.4 Final verification
  - [ ] All features work as expected
  - [ ] No console errors or warnings
  - [ ] Documentation is up to date
  - [ ] Code is ready for production

## Dependencies and Sequencing

**Sequential (must complete in order):**
1. Phase 1 (Debug) → Phase 2 (Install) → Phase 3 (Build)
2. Phase 3 (Build) → Phase 4 (Connect)
3. Phase 4 (Connect) → Phase 5 (Test)

**Can parallelize within phases:**
- Phase 3: Components 3.1, 3.2, 3.3 can be built in parallel
- Phase 4: Tasks 4.1, 4.2, 4.3 are mostly independent

**Estimated Effort:**
- Phase 1: 1-2 hours (debugging database/API issues)
- Phase 2: 30 minutes (shadcn/ui setup)
- Phase 3: 2-3 hours (component implementation)
- Phase 4: 1-2 hours (integration and wiring)
- Phase 5: 1 hour (testing and verification)
- Phase 6: 30 minutes (documentation)

**Total: 6-9 hours for complete implementation**
