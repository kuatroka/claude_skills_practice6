# Capability: Prompt Management

## ADDED Requirements

### Requirement: Create Prompt
The system SHALL allow users to create new prompts with a name and text content.

#### Scenario: User creates a new prompt
- **WHEN** user clicks "New Prompt" button
- **THEN** a form modal opens with empty name and text fields

#### Scenario: User submits new prompt
- **WHEN** user enters name "Code Review" and text "Review this code..." and clicks Submit
- **THEN** the prompt is created with id, name, text, created_at, updated_at
- **AND** the prompt appears in the list immediately (optimistic update)
- **AND** the form modal closes

#### Scenario: Submit with empty fields fails validation
- **WHEN** user clicks Submit without entering name or text
- **THEN** form validation error appears
- **AND** prompt is not created

#### Scenario: New prompt syncs to other devices
- **WHEN** prompt is created on device A
- **THEN** it automatically appears on device B within <100ms via real-time sync

### Requirement: Read Prompts
The system SHALL allow users to view all prompts in a list ordered by creation date (newest first).

#### Scenario: View prompt list
- **WHEN** user opens the app
- **THEN** all prompts are displayed in a list
- **AND** prompts are ordered by created_at descending

#### Scenario: View individual prompt details
- **WHEN** user looks at a prompt card in the list
- **THEN** the card displays: name, text content, creation date

### Requirement: Update Prompt
The system SHALL allow users to edit existing prompts.

#### Scenario: User opens edit form
- **WHEN** user clicks edit button on a prompt card
- **THEN** the form modal opens with current name and text populated

#### Scenario: User updates prompt
- **WHEN** user changes name to "Code Review v2" and clicks Submit
- **THEN** the prompt is updated with new values
- **AND** updated_at timestamp is refreshed
- **AND** list view reflects changes immediately (optimistic update)

#### Scenario: Updated prompt syncs to other devices
- **WHEN** prompt is updated on device A
- **THEN** it automatically updates on device B within <100ms

### Requirement: Delete Prompt
The system SHALL allow users to delete prompts permanently.

#### Scenario: User deletes a prompt
- **WHEN** user clicks delete button on a prompt card
- **THEN** a confirmation dialog appears

#### Scenario: User confirms deletion
- **WHEN** user clicks "Confirm" in the confirmation dialog
- **THEN** the prompt is deleted from the database
- **AND** it disappears from the list immediately (optimistic update)

#### Scenario: Deleted prompt is removed from other devices
- **WHEN** prompt is deleted on device A
- **THEN** it automatically disappears from device B within <100ms

### Requirement: Prompt Data Structure
The system SHALL store prompts with the following schema:

#### Scenario: Prompt record structure
- **GIVEN** a prompt in the database
- **WHEN** the prompt is queried
- **THEN** it contains: id (TEXT, unique), name (TEXT), text (TEXT), created_at (INTEGER, Unix timestamp), updated_at (INTEGER, Unix timestamp)

### Requirement: Persistent Storage
The system SHALL persist all prompts in SQLite database.

#### Scenario: Prompts survive server restart
- **GIVEN** prompts are created and synced
- **WHEN** the Trailbase server restarts
- **THEN** all prompts are still available when the app reconnects

## MODIFIED Requirements
(None - this is a new capability)

## REMOVED Requirements
(None - this is a new capability)
