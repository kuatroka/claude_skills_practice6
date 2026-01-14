# Change: Improve UI and Fix Data Display Issues

## Why

The current Prompt Library application has critical issues that prevent users from verifying that their data is being saved:

1. **No data persistence**: Prompts are not being saved to the database despite successful form submission
2. **No data display**: The PromptList component shows an empty state even when data exists
3. **Poor UX**: The UI lacks professional components, making it difficult to:
   - See a clear list of saved prompts in a table format
   - Understand the current state of the application
   - Authenticate with the backend
   - Navigate between different sections

These issues prevent users from confirming that the CRUD operations actually work.

## What Changes

This change improves the application across three areas:

### 1. Fix Data Persistence (Critical Bug Fix)
- **Problem**: TanStack DB collection is not properly initialized or syncing with Trailbase
- **Solution**:
  - Debug and fix the Record API integration
  - Implement proper error handling and logging
  - Verify data is actually persisted to SQLite database

### 2. Implement Professional UI with shadcn/ui
- **Install shadcn/ui**: Add component library for consistent, professional components
- **Replace custom components** with shadcn/ui equivalents where appropriate
- **Create new components**:
  - AppShell/Layout with sidebar navigation
  - DataTable for displaying prompts (searchable, sortable)
  - Form components (using shadcn/ui form validation)
  - User login component for authentication
  - Breadcrumbs for navigation context

### 3. Fix Prompt Display
- **Load prompts from database** on component mount
- **Display in table format** with columns: Name, Text (preview), Created At, Actions
- **Enable sorting and filtering** in the table
- **Show no-data state** clearly when database is empty

## Impact

- **User Capability**: Users can now confirm that prompts are saved and view all prompts in a professional table
- **Development**: Better error visibility for debugging data flow issues
- **Architecture**: Establishes proper shadcn/ui component patterns for future features
- **Quality**: Professional, accessible UI components from shadcn/ui library

## Affected Specs

This change builds on the existing `add-prompt-library-app` spec and:
- MODIFIES: Frontend data loading and display logic
- MODIFIES: UI component implementation
- ADDS: User authentication UI component
- ADDS: Professional layout/shell component
- ADDS: Data table component with sorting/filtering

## Technical Approach

### 1. Debug and Fix TanStack DB Integration
- Review Trailbase client initialization
- Check Record API configuration
- Add console logging to track data flow
- Test direct SQLite queries vs. API calls

### 2. Install and Configure shadcn/ui
- Add shadcn/ui dependencies and CLI
- Configure component output location
- Install base components (Button, Input, Table, Form, Dialog, etc.)

### 3. Refactor Components
- Create `AppLayout` component with header and sidebar
- Create `PromptsTable` component using shadcn/ui Table
- Create `LoginForm` component for authentication
- Update App.tsx to use new layout

### 4. Verify Data Flow
- Add proper error handling with user feedback
- Implement database query verification
- Test full create → save → display → update → delete cycle
