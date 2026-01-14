# Capability: Real-Time Sync

## ADDED Requirements

### Requirement: Real-Time Synchronization Across Devices
The system SHALL synchronize prompt changes across multiple devices or browser tabs in real-time.

#### Scenario: Prompt created on device A appears on device B
- **GIVEN** user has the app open on two devices (A and B)
- **WHEN** a new prompt is created on device A
- **THEN** the prompt automatically appears on device B within <100ms
- **AND** no manual refresh is required

#### Scenario: Prompt updated on device A reflects on device B
- **GIVEN** two devices are showing the same prompt
- **WHEN** the prompt is updated on device A
- **THEN** the update appears on device B within <100ms
- **AND** no manual refresh is required

#### Scenario: Deleted prompt disappears on other device
- **GIVEN** a prompt exists on both devices
- **WHEN** the prompt is deleted on device A
- **THEN** it automatically disappears from device B within <100ms

#### Scenario: Sync works across browser tabs
- **GIVEN** user has the app open in two browser tabs
- **WHEN** a prompt is created in tab 1
- **THEN** it automatically appears in tab 2 within <100ms

### Requirement: Optimistic Updates
The system SHALL provide optimistic updates so changes appear immediately on the user's device before being confirmed by the server.

#### Scenario: Create prompt shows immediately
- **WHEN** user creates a new prompt and clicks Submit
- **THEN** the prompt appears in the list immediately (before server confirmation)
- **AND** the form closes immediately

#### Scenario: Edit prompt updates immediately
- **WHEN** user edits a prompt name and clicks Submit
- **THEN** the updated name appears in the list immediately (before server confirmation)

#### Scenario: Delete prompt removes immediately
- **WHEN** user confirms deletion of a prompt
- **THEN** the prompt disappears from the list immediately (before server confirmation)

### Requirement: Conflict Resolution
The system SHALL handle concurrent updates gracefully using last-write-wins strategy.

#### Scenario: Two users edit same prompt concurrently
- **GIVEN** two users edit the same prompt simultaneously
- **WHEN** both changes are sent to server
- **THEN** the last write prevails
- **AND** both devices converge to the same state

#### Scenario: Optimistic update conflicts with server state
- **WHEN** user makes a change optimistically but server rejects it
- **THEN** the local change is rolled back to match server state
- **AND** user is notified of the conflict

### Requirement: Automatic Connection Management
The system SHALL maintain connection to the server and automatically reconnect if lost.

#### Scenario: Temporary network outage
- **GIVEN** user loses internet connectivity
- **WHEN** connection is restored
- **THEN** the app automatically reconnects to the server
- **AND** any pending mutations are synced
- **AND** latest server state is fetched

#### Scenario: Changes during offline period
- **GIVEN** user creates/edits prompts while offline
- **WHEN** connection is restored
- **THEN** pending changes are synced to the server
- **AND** server state is merged with local changes

### Requirement: Live Query Reactivity
The system SHALL provide reactive live queries that update automatically when underlying data changes.

#### Scenario: List updates when new prompt created
- **GIVEN** user is viewing the prompt list
- **WHEN** a new prompt is created (on this device or another)
- **THEN** the list automatically updates to include the new prompt
- **AND** no manual refresh is required

#### Scenario: Sorted list maintains order
- **GIVEN** the list is sorted by creation date (newest first)
- **WHEN** new prompts are created at different times
- **THEN** the list automatically maintains correct sort order

### Requirement: WebSocket Communication
The system SHALL use WebSocket connections for real-time updates.

#### Scenario: WebSocket connection established
- **WHEN** user opens the app
- **THEN** a WebSocket connection is established to the Trailbase server
- **AND** the connection stays open for the session

#### Scenario: Server sends subscription updates
- **GIVEN** a WebSocket connection is active
- **WHEN** data changes on the server
- **THEN** updates are pushed to the client via WebSocket
- **AND** the UI reactively updates

## MODIFIED Requirements
(None - this is a new capability)

## REMOVED Requirements
(None - this is a new capability)

## Implementation Notes

- Built on TanStack DB with Trailbase integration
- Uses Trailbase Record API subscriptions (WebSocket)
- TanStack DB collections handle optimistic updates automatically
- External state management via createCollection() with trailBaseCollectionOptions
- Live queries powered by differential dataflow (sub-millisecond updates)
- Connection retry with exponential backoff
- Automatic conflict resolution (last-write-wins)
