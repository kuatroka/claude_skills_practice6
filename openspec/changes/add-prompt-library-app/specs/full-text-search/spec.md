# Capability: Full-Text Search

## ADDED Requirements

### Requirement: Search Prompts by Name and Text
The system SHALL provide full-text search functionality that searches across both prompt names and text content.

#### Scenario: User searches for prompt by name
- **WHEN** user types "code review" in the search box
- **THEN** results show prompts with "code review" in the name
- **AND** results appear in <20ms

#### Scenario: User searches for prompt by text content
- **WHEN** user types "async function" in the search box
- **THEN** results show prompts with "async function" in the text
- **AND** results appear in <20ms

#### Scenario: Search returns results ranked by relevance
- **WHEN** user searches for "test"
- **THEN** prompts with "test" in the name appear before prompts with "test" only in the text

#### Scenario: Search with partial word (prefix matching)
- **WHEN** user types "cod" in the search box
- **THEN** results include prompts with "code", "coding", "coder", etc.

#### Scenario: Empty search shows all prompts
- **WHEN** user clears the search box or loads the page with no search query
- **THEN** the system shows all prompts in the default list view

### Requirement: Case-Insensitive Search
The system SHALL perform case-insensitive full-text search.

#### Scenario: Search with mixed case
- **WHEN** user searches for "CODE REVIEW" or "code review"
- **THEN** both return the same results regardless of case

### Requirement: Search Performance
The system SHALL return search results within 20 milliseconds for typical prompt collections (up to 10,000 prompts).

#### Scenario: Verify search latency
- **WHEN** user performs a search query
- **THEN** results appear in <20ms as measured by browser performance tools
- **AND** search remains responsive during typing

#### Scenario: Large collection search performance
- **GIVEN** the database contains 10,000 prompts
- **WHEN** user searches for a common term
- **THEN** results appear in <20ms

### Requirement: Search Index Synchronization
The system SHALL keep the full-text search index synchronized with the prompts table automatically.

#### Scenario: New prompt appears in search immediately after creation
- **GIVEN** a new prompt "Python Script" is created
- **WHEN** the user searches for "Python"
- **THEN** the new prompt appears in results immediately

#### Scenario: Updated prompt reflects in search
- **GIVEN** a prompt is updated with new text
- **WHEN** the user searches for a term in the new text
- **THEN** the updated content appears in search results immediately

#### Scenario: Deleted prompt disappears from search
- **GIVEN** a prompt is deleted
- **WHEN** the user searches for its content
- **THEN** the deleted prompt no longer appears in results

### Requirement: Multi-Term Search
The system SHALL support searching for multiple terms.

#### Scenario: Search with multiple keywords
- **WHEN** user searches for "code review async"
- **THEN** results include prompts containing all three terms

#### Scenario: Search with phrase (quoted text)
- **WHEN** user searches for "code review"
- **THEN** results prioritize prompts with the exact phrase

## MODIFIED Requirements
(None - this is a new capability)

## REMOVED Requirements
(None - this is a new capability)

## Implementation Notes

- Uses SQLite FTS5 (Full-Text Search 5) virtual table
- Implements external content table with `content='prompts'`
- Prefix indexes enabled: `prefix='2 3'` for fast prefix matching
- Tokenizer: `porter ascii` for stemming and ASCII optimization
- Column detail: `detail='column'` for smaller index
- Automerge setting: `automerge=8` for read-heavy workload
- Query endpoint: `GET /api/search/prompts?q=<query>`
