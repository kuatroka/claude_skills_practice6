<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Tech stack
Trailbase, tanstack, React 19, tanstack-db-sync, SQLite

## JS runtime and package managers
**bun**

## Commands
`bun run dev`
`bun add`

## Test
## Test
- Before stating the issue is fixed, always use **claude in chrome**, **chrome devtools**, or **playwright** to test features/edits/code that is connected to browser or web.
- Berore stating the issue is fixed always consult server logs first without and then while interacting with ui.
