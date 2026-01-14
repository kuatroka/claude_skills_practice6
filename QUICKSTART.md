# Quick Start Guide - Prompt Library Application

Get the Prompt Library application running in 5 minutes.

## Prerequisites

- Trailbase v0.22.11+ installed (`curl -sSL https://trailbase.io/install.sh | bash`)
- Bun 1.3.6+ installed

## Step 1: Start the Backend

Open a terminal and run:

```bash
cd traildepot
trail run --address localhost:4000
```

You should see:
```
[INFO] Listening on http://localhost:4000 🚀
[INFO] Admin UI http://localhost:4000/_/admin/
```

**Save the admin credentials** displayed in the console.

## Step 2: Start the Frontend

Open another terminal and run:

```bash
cd frontend
bun install  # Only needed first time
bun run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
```

## Step 3: Open the Application

Navigate to `http://localhost:5173` in your browser.

You should see the Prompt Library interface with:
- **Prompt Library** heading
- **New Prompt** button
- Search bar

## Step 4: Create Your First Prompt

1. Click **"New Prompt"** button
2. Enter a name (e.g., "Product Description")
3. Enter prompt text (e.g., "Write a compelling product description...")
4. Click **"Create"**

The prompt should appear in the grid below the search bar.

## Step 5: Test Features

- **Search**: Type in the search bar to filter prompts by name or text
- **Copy**: Click the copy icon on a prompt to copy it to clipboard
- **Edit**: Click the edit icon to modify a prompt
- **Delete**: Click the trash icon to remove a prompt

## Accessing the Admin UI

For user management and other admin tasks:

1. Navigate to `http://localhost:4000/_/admin/`
2. Sign in with the credentials displayed when Trailbase started
3. Manage users and database through the admin interface

## Stopping the Servers

To stop the servers:

```bash
# Kill backend
pkill -f "trail run"

# Kill frontend (in the frontend terminal, press Ctrl+C)
```

## Troubleshooting

### Frontend shows "Failed to load prompts"
- Ensure Trailbase backend is running on localhost:4000
- Check that no firewall is blocking the connection
- Open browser console (F12) for more details

### Can't connect to backend
- Backend should output "Listening on http://localhost:4000"
- If port 4000 is in use, kill the process: `pkill -f "trail run"`

### Build errors
- Delete `frontend/node_modules` and `frontend/.bun` directories
- Run `bun install` again

## Next Steps

- Read the full [README.md](README.md) for architecture details
- Check the [OpenSpec proposal](openspec/changes/add-prompt-library-app/proposal.md) for feature details
- Review the database [migrations](traildepot/migrations/) for schema details

## Architecture

- **Backend**: Trailbase (single binary) with SQLite + FTS5
- **Frontend**: React + Vite + TanStack DB
- **Communication**: HTTP REST API with real-time subscriptions
- **Styling**: TailwindCSS

Enjoy managing your prompts! 🚀
