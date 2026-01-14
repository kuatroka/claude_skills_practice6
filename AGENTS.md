# Development Workflow
**Always use 'bun', not 'npm'.**

```sh
# 1. Make changes
# 2. Typecheck (fast)
bun run typecheck
# 3. Run tests
bun run test -- -t "test name"      # Single suite
bun run test:file - "glob"          # Specific files
# 4. Lint before committing
bun run lint:file - "file.ts"       # Specific files
bun run lint                        # All files
#5. Before creating PR
bun run lint:claude && bun run test

```

## Tech stack
Trailbase, tanstack, React 19, tanstack-db-sync, SQLite

## Test
Before stating the issue is fixed, always use 1st **claude in chrome** or 2nd **chrome devtools** or  3rd **playwright** to test features/edits/code that is connected to browser or web. Always check server logs first when starting the server and then while interacting with ui.
