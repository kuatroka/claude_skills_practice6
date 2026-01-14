-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Create index on created_at for efficient sorting
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
