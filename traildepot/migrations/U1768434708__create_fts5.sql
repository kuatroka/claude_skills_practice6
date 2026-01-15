-- FTS5 virtual table for instant full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
    name,
    text,
    content='prompts',
    content_rowid='rowid',
    tokenize='porter unicode61',
    prefix='2 3 4'
);

-- Auto-sync triggers
CREATE TRIGGER IF NOT EXISTS prompts_ai AFTER INSERT ON prompts BEGIN
    INSERT INTO prompts_fts(rowid, name, text) VALUES (NEW.rowid, NEW.name, NEW.text);
END;

CREATE TRIGGER IF NOT EXISTS prompts_ad AFTER DELETE ON prompts BEGIN
    INSERT INTO prompts_fts(prompts_fts, rowid, name, text) VALUES ('delete', OLD.rowid, OLD.name, OLD.text);
END;

CREATE TRIGGER IF NOT EXISTS prompts_au AFTER UPDATE ON prompts BEGIN
    INSERT INTO prompts_fts(prompts_fts, rowid, name, text) VALUES ('delete', OLD.rowid, OLD.name, OLD.text);
    INSERT INTO prompts_fts(rowid, name, text) VALUES (NEW.rowid, NEW.name, NEW.text);
END;
