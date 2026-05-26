-- Migration 001: Add source normalization fields to movies and episodes

-- Update movies table
ALTER TABLE movies
ADD COLUMN source VARCHAR(50) DEFAULT 'manual',
ADD COLUMN source_slug VARCHAR(255) NULL,
ADD COLUMN thumbnail_url TEXT NULL,
ADD COLUMN language VARCHAR(100) NULL,
ADD COLUMN current_episode VARCHAR(100) NULL,
ADD COLUMN total_episodes VARCHAR(100) NULL,
ADD COLUMN last_synced_at DATETIME NULL;

-- Create indexes if they don't exist
-- We can't use IF NOT EXISTS for indexes in standard MySQL easily, so we assume they don't exist in the base schema.
-- In a real migration system we'd check if they exist first, or we can just try to create them.
ALTER TABLE movies ADD UNIQUE INDEX idx_movies_source_slug (source, source_slug);
ALTER TABLE movies ADD INDEX idx_movies_slug (slug);
ALTER TABLE movies ADD INDEX idx_movies_source (source);
ALTER TABLE movies ADD INDEX idx_movies_last_synced_at (last_synced_at);

-- Update episodes table
ALTER TABLE episodes
ADD COLUMN source VARCHAR(50) DEFAULT 'manual',
ADD COLUMN source_episode_slug VARCHAR(255) NULL,
ADD COLUMN server_name VARCHAR(255) NULL,
ADD COLUMN embed_url TEXT NULL,
ADD COLUMN sort_order INT DEFAULT 0,
ADD COLUMN last_synced_at DATETIME NULL;

ALTER TABLE episodes ADD INDEX idx_episodes_movie_id (movie_id);
ALTER TABLE episodes ADD INDEX idx_episodes_source (source);
ALTER TABLE episodes ADD INDEX idx_episodes_movie_source (movie_id, source);

-- Create source_sync_logs table
CREATE TABLE IF NOT EXISTS source_sync_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_key VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_code INT NULL,
    error_code VARCHAR(100) NULL,
    error_message TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create source_aliases table
CREATE TABLE IF NOT EXISTS source_aliases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    source VARCHAR(50) NOT NULL,
    source_slug VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_source_slug (source, source_slug),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
