# Specification: User Authentication and Access Control

## ADDED Requirements

### Requirement: User Authentication Form
- **New**: The system SHALL provide login interface for users to authenticate with Trailbase
- **Component**: LoginForm
- **Details**:
  - MUST provide email input field with validation (email format required)
  - MUST provide password input field (masked/hidden)
  - MUST display "Sign In" button
  - MUST display error message for failed authentication
  - MUST show loading state during authentication request
  - MAY include optional link to sign up (can be deferred)
  - MUST style form matching shadcn/ui design system

#### Scenario: User logs in with email and password
1. User is not logged in (no auth token in localStorage)
2. LoginForm component is displayed
3. User enters email: user@example.com
4. User enters password: (masked input)
5. User clicks "Sign In" button
6. Button shows "Signing in..." and is disabled
7. Frontend sends POST request to authentication endpoint
8. Backend validates credentials
9. Backend returns auth token and user info
10. Token is stored in localStorage with key "auth_token"
11. User is logged in and sees main application
12. All subsequent requests include `Authorization: Bearer <token>` header

### Requirement: Session Management
- **New**: The system MUST maintain user session and handle authentication state
- **Details**:
  - MUST check for existing auth token on app load
  - MUST store token in localStorage (or sessionStorage)
  - MUST automatically include token in all API requests
  - MUST handle 401 responses by clearing token and showing login
  - MUST provide logout button in header/menu
  - MUST clear token on logout

#### Scenario: User session persists across page reloads
1. User logs in with email and password
2. Auth token is stored in localStorage
3. User closes browser or refreshes page
4. App loads and checks localStorage for token
5. Token exists, so user is automatically logged in
6. App displays main interface without login form
7. No re-authentication required
8. User can see all their saved prompts

#### Scenario: User logs out
1. User clicks "Logout" button in header
2. Auth token is removed from localStorage
3. User is redirected to login form
4. All previous session data is cleared
5. User can log in again with different credentials

### Requirement: Authentication Error Handling
- **New**: The system SHALL display clear error messages for authentication failures
- **Details**:
  - MUST show "Please enter a valid email address" for invalid email format
  - MUST show "Email and password are required" for missing credentials
  - MUST show "Invalid email or password" for wrong password
  - MUST show "Invalid email or password" for account not found (for security)
  - MUST show "Failed to sign in. Please check your connection." for network errors
  - MUST show "Session expired. Please sign in again." for 401 Unauthorized
  - MUST show "An error occurred. Please try again later." for server errors

#### Scenario: User sees clear error messages for authentication issues
1. User enters invalid email format
2. Form shows error: "Please enter a valid email address"
3. Submit button remains disabled
4. User corrects email format
5. Error message clears
6. User enters email and password
7. Clicks Sign In
8. Server returns 401 Unauthorized (wrong password)
9. Error message appears: "Invalid email or password"
10. Form resets with email retained, password cleared
11. User can retry

### Requirement: Protected Routes and Content
- **New**: The system MUST only show main application content to authenticated users
- **Details**:
  - MUST show LoginForm if user is not authenticated
  - MUST show AppLayout with PromptsTable if user is authenticated
  - MUST check authentication status on app load
  - MUST redirect to login if session expires

#### Scenario: User cannot access app without authentication
1. User opens application without auth token
2. LoginForm is displayed (not the main app)
3. User cannot see prompts, search, or create buttons
4. User must log in first to access app
5. After login, auth token is validated
6. Main app is displayed with user's prompts

### Requirement: Token Management and Refresh
- **New**: The system MUST handle auth token lifecycle including expiration and refresh
- **Details**:
  - MUST store both access token and refresh token (if provided by backend)
  - SHOULD automatically refresh token before expiration (optional)
  - MUST handle 401 responses by offering to re-login
  - MUST clear invalid tokens from storage

#### Scenario: User's token expires and is refreshed
1. User is logged in with valid access token
2. Backend returns response with `X-Refresh-Token` header (or equivalent)
3. Frontend detects token expiration window approaching (if implemented)
4. Frontend requests new access token using refresh token
5. New token is stored, session continues
6. User doesn't need to re-login

#### Scenario: User token expires and must login again
1. User is logged in
2. Token expires
3. User makes a request to app
4. Backend returns 401 Unauthorized
5. Frontend clears invalid token
6. User is redirected to LoginForm
7. Message appears: "Session expired. Please sign in again."
8. User logs in with credentials again
