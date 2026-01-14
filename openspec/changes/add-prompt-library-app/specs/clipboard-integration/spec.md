# Capability: Clipboard Integration

## ADDED Requirements

### Requirement: Copy Prompt to Clipboard
The system SHALL allow users to copy the full prompt text to their clipboard with a single click.

#### Scenario: User clicks copy button
- **WHEN** user clicks the copy button on a prompt card
- **THEN** the prompt text is copied to the user's clipboard
- **AND** visual feedback ("Copied!") is displayed for 2 seconds
- **AND** the feedback message disappears after 2 seconds

#### Scenario: Copied text can be pasted
- **GIVEN** user has copied a prompt
- **WHEN** user pastes (Ctrl+V or Cmd+V)
- **THEN** the prompt text is pasted into the target application

#### Scenario: Only text is copied, not metadata
- **WHEN** user copies a prompt
- **THEN** only the prompt text content is copied
- **AND** the name, timestamps, and other metadata are not included

### Requirement: Copy Feedback
The system SHALL provide visual feedback when copy succeeds or fails.

#### Scenario: Successful copy shows feedback
- **WHEN** user clicks copy on a prompt
- **THEN** the card shows "Copied!" message
- **AND** the message is visible for 2 seconds then disappears

#### Scenario: Copy button is accessible
- **WHEN** user views a prompt card
- **THEN** a copy button with clipboard icon is visible and clickable

### Requirement: Clipboard Access Permission
The system SHALL handle clipboard permission requests gracefully.

#### Scenario: First copy attempt with permission prompt
- **WHEN** user clicks copy for the first time
- **THEN** the browser may request clipboard permission
- **AND** if granted, the copy succeeds
- **AND** if denied, an error message is shown

#### Scenario: Copy works on localhost and HTTPS
- **GIVEN** the app is running on localhost or HTTPS
- **WHEN** user clicks copy
- **THEN** the clipboard operation succeeds

## MODIFIED Requirements
(None - this is a new capability)

## REMOVED Requirements
(None - this is a new capability)

## Implementation Notes

- Uses modern Clipboard API: `navigator.clipboard.writeText()`
- No external dependencies required
- Fallback: For older browsers, uses document.execCommand('copy') with textarea
- HTTPS required in production (HTTP allowed on localhost for development)
- Copy button uses lucide-react Copy icon
