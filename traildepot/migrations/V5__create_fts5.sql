-- Create FTS5 virtual table with optimizations
CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
  name UNINDEXED,
  text UNINDEXED,
  content='prompts',
  content_rowid='id',
  prefix='2 3',
  detail='column',
  tokenize='porter ascii'
);

-- Create triggers to automatically sync the FTS5 index
CREATE TRIGGER IF NOT EXISTS prompts_ai AFTER INSERT ON prompts BEGIN
  INSERT INTO prompts_fts(rowid, name, text) VALUES (NEW.id, NEW.name, NEW.text);
END;

CREATE TRIGGER IF NOT EXISTS prompts_ad AFTER DELETE ON prompts BEGIN
  INSERT INTO prompts_fts(prompts_fts, rowid, name, text) VALUES('delete', OLD.id, OLD.name, OLD.text);
END;

CREATE TRIGGER IF NOT EXISTS prompts_au AFTER UPDATE ON prompts BEGIN
  INSERT INTO prompts_fts(prompts_fts, rowid, name, text) VALUES('delete', OLD.id, OLD.name, OLD.text);
  INSERT INTO prompts_fts(rowid, name, text) VALUES (NEW.id, NEW.name, NEW.text);
END;
