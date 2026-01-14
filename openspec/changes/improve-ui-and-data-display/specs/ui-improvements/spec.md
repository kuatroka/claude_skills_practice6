# Specification: UI Component Improvements with shadcn/ui

## ADDED Requirements

### Requirement: Professional Application Layout
- **New**: The system SHALL create a professional application shell with header and navigation
- **Components**: AppLayout, AppShell
- **Details**:
  - MUST display header with application title and primary action button ("New Prompt")
  - MAY include optional sidebar for future navigation
  - MUST support responsive design (mobile, tablet, desktop)
  - MUST use consistent spacing and color scheme from shadcn/ui theme

#### Scenario: User sees professional application layout
1. User opens the application
2. Header displays "Prompt Library" title
3. "New Prompt" button is visible in header, always accessible
4. Main content area displays below header
5. Layout is responsive on mobile (button moves or wraps)
6. Header and content have clear visual hierarchy
7. Colors and spacing follow shadcn/ui design system

### Requirement: Data Display in Table Format
- **New**: The system SHALL display prompts in a professional data table with sorting and filtering
- **Component**: PromptsTable
- **Details**:
  - MUST have table columns: Name, Text (preview), Created At, Actions
  - MUST support sortable columns (click header to sort ascending/descending)
  - MUST support searchable by name and text (client-side filter)
  - MUST provide row actions: Edit, Delete, Copy (with icons from lucide-react)
  - MUST display empty state message when no data
  - MUST show loading indicator while fetching data
  - SHOULD support pagination optional (if >100 prompts)

#### Scenario: User searches and sorts prompts in table
1. PromptsTable displays all saved prompts
2. Each row shows: prompt name, first 100 chars of text, creation date
3. User clicks "Name" column header to sort ascending by name
4. User clicks again to sort descending by name
5. User types "product" in search field
6. Table updates to show only prompts matching "product"
7. Search works on both name and text content
8. Sorting and search work together correctly
9. Row actions (Edit, Delete, Copy) are aligned to the right
10. Copy button shows feedback: icon changes to checkmark for 2 seconds

### Requirement: Improved Form Dialogs
- **New**: The system MUST use shadcn/ui Form component for create/edit prompts
- **Component**: Updated PromptForm
- **Details**:
  - MUST validate form: Name required, Text required
  - MUST display error messages below each field
  - MUST disable submit button while submitting
  - MUST change submit button text to "Saving..." during submission
  - MUST close dialog on successful save
  - MUST show success toast notification: "Prompt saved!"
  - MUST show error toast notification with error details

#### Scenario: User creates a new prompt with form validation
1. User clicks "New Prompt" button
2. Dialog opens with form fields (Name, Text)
3. Fields are empty and Create button is enabled
4. User clicks Create without filling fields
5. Validation errors appear: "Name is required" and "Text is required"
6. Fields are highlighted in red
7. User fills in both fields
8. Errors clear automatically
9. User clicks Create button
10. Button shows "Saving..." and is disabled
11. Request sends to backend
12. Success toast appears: "Prompt saved!"
13. Dialog closes automatically
14. New prompt appears in table

### Requirement: Notification System
- **New**: The system MUST display user feedback with toast notifications
- **Component**: Sonner Toast system (via shadcn/ui)
- **Details**:
  - MUST display success toast with green background and checkmark icon
  - MUST display error toast with red background and X icon
  - MUST display info toast with blue background and info icon
  - MUST auto-dismiss toasts after 5 seconds
  - MUST allow user to dismiss toasts manually
  - SHOULD limit to max 3 visible toasts simultaneously

#### Scenario: User sees feedback for all operations
1. Create prompt → Success toast: "Prompt saved!"
2. Delete prompt → Success toast: "Prompt deleted!"
3. Copy to clipboard → Success toast: "Copied to clipboard!"
4. Network error → Error toast: "Failed to save: Network error"
5. Each toast appears for 5 seconds then auto-dismisses
6. User can click X to dismiss immediately

### Requirement: Improved Navigation and Context
- **New**: The system SHALL provide clear navigation and breadcrumbs for context
- **Components**: Optional breadcrumbs, sidebar
- **Details**:
  - SHOULD display breadcrumbs showing current location (Home > Prompts, etc.)
  - MUST maintain consistent navigation across pages
  - MUST highlight active page in sidebar
  - MUST collapse sidebar to hamburger menu on mobile

#### Scenario: User knows where they are in the application
1. App displays breadcrumbs: "Home > Prompts"
2. Sidebar shows "Prompts" as highlighted/active
3. User navigates to different sections (if added)
4. Breadcrumbs update to show current path
5. On mobile, sidebar collapses to hamburger icon
6. Hamburger menu opens/closes sidebar

## MODIFIED Requirements

### Requirement: Search Component
- Currently, the SearchBar component has minimal styling and is separate from the table. The system SHALL integrate search into the table as a built-in filter.
- **Details**:
  - MUST provide input field in header or table controls
  - MUST support real-time filtering as user types
  - SHOULD display number of matches
  - MUST provide clear button to reset search
  - MUST use placeholder text: "Search by name or content..."

#### Scenario: User searches prompts using integrated search
1. User sees search input at top of prompts table
2. Placeholder text: "Search by name or content..."
3. User types "API" to find prompts about APIs
4. Table instantly filters to matching prompts
5. Column header shows: "Showing 3 of 10 prompts"
6. User clicks clear button (X icon)
7. Search clears and all prompts display again
8. User can still sort while search is active
