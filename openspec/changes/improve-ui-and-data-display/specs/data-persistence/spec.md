# Specification: Data Persistence and Database Integration

## MODIFIED Requirements

### Requirement: Prompt Creation and Persistence
- Currently, form submission calls `promptsCollection.insert()` but data doesn't appear in database. The system SHALL implement proper data flow from form submission through TanStack DB/Trailbase API to SQLite database.
- **Details**:
  - Form submission SHALL result in HTTP POST to `/api/records/v1/prompts`
  - Request MUST include proper authentication token
  - Response MUST confirm successful insertion with saved prompt ID and timestamps
  - Data MUST be verifiable in SQLite with `SELECT * FROM prompts` query

#### Scenario: User creates a new prompt
1. User clicks "New Prompt" button
2. User fills in name: "Product Description" and text: "Write a compelling..."
3. User clicks "Create" button
4. Frontend sends POST request to `/api/records/v1/prompts` with prompt data
5. Backend stores prompt in `prompts` table
6. Response includes saved prompt with ID and timestamps
7. User sees success toast notification
8. New prompt appears in the prompts table/list
9. Prompt persists after page reload
10. Verification: `sqlite3 traildepot/data/main.db "SELECT COUNT(*) FROM prompts;"` returns 1

### Requirement: Prompt Retrieval and Display
- Currently, PromptList component displays hardcoded empty array. The system SHALL load prompts from Trailbase API on component mount and display them in a table.
- **Details**:
  - Component MUST query `/api/records/v1/prompts` on mount
  - MUST handle loading state while fetching
  - MUST display results in sortable, searchable table
  - MUST display empty state when no prompts exist
  - MUST refresh data when prompts are created/updated/deleted

#### Scenario: User views saved prompts in table
1. App loads with authenticated user
2. PromptsTable component mounts
3. Component fetches prompts via GET `/api/records/v1/prompts`
4. Table displays loading indicator
5. Prompts load and display in table rows with columns:
   - Name (sortable)
   - Text preview (truncated to 100 chars)
   - Created date (sortable)
   - Actions (Edit, Delete, Copy)
6. User can search prompts by typing in search field
7. Table filters in real-time as user types
8. Table remains synchronized when prompts are edited elsewhere

### Requirement: Database Schema Verification
- Currently, it is unclear if the database is properly initialized. The system SHALL verify and document database schema and constraints.
- **Details**:
  - Prompts table MUST have required columns: id, name, text, created_at, updated_at
  - All columns MUST have appropriate constraints (NOT NULL, etc.)
  - Created/updated timestamps MUST be Unix milliseconds
  - FTS5 index MUST properly sync with insert/update/delete operations

#### Scenario: Developer verifies database integrity
1. Developer connects to SQLite: `sqlite3 traildepot/data/main.db`
2. Checks schema: `.schema prompts` shows all required columns
3. Inserts test data and verifies FTS5 index syncs
4. Queries FTS5: `SELECT * FROM prompts_fts WHERE prompts_fts MATCH 'test'` returns result
5. Deletes test data and verifies index is cleaned up
6. Creates prompt via UI and verifies in database

## ADDED Requirements

### Requirement: Authentication Token Handling
- **New**: The system MUST handle Trailbase authentication tokens for API requests
- **Details**:
  - MUST store authentication token in localStorage
  - MUST include token in Authorization header for all API requests
  - MUST handle 401 Unauthorized responses by clearing token and showing login
  - SHOULD refresh token if backend supports token refresh mechanism

#### Scenario: User provides authentication credentials
1. User is not authenticated (no token in localStorage)
2. LoginForm component is displayed
3. User enters email and password
4. Frontend sends POST to `/auth/login` (or equivalent)
5. Backend returns auth token
6. Token is stored in localStorage
7. User is redirected to main app
8. All subsequent requests include `Authorization: Bearer <token>` header
9. If token expires, user is redirected to login

### Requirement: Error Handling and User Feedback
- **New**: The system MUST display errors to user when data operations fail
- **Details**:
  - Network errors MUST show: "Failed to connect to server"
  - Database errors MUST show: "Error saving prompt: ..."
  - Validation errors MUST show: "Name is required" or similar
  - Authentication errors MUST show: "Session expired, please login"
  - All errors MUST be visible to user via toast notifications

#### Scenario: User sees error when data operation fails
1. User creates a prompt
2. Network connection is lost
3. Frontend shows error toast: "Failed to save prompt"
4. Form remains open for retry
5. User can close form and try again
6. Toast auto-dismisses after 5 seconds
