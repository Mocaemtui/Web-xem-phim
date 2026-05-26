const pool = require('../db/pool');

class MovieRepository {
  async findBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM movies WHERE slug = ?', [slug]);
    return rows[0] || null;
  }

  async findBySourceSlug(source, sourceSlug) {
    try {
      const [rows] = await pool.query('SELECT * FROM movies WHERE source = ? AND source_slug = ?', [source, sourceSlug]);
      return rows[0] || null;
    } catch (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        // Column doesn't exist, return null
        return null;
      }
      throw err;
    }
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async findBySlugWithEpisodes(slug) {
    const movie = await this.findBySlug(slug);
    if (!movie) return null;
    
    const [episodes] = await pool.query('SELECT * FROM episodes WHERE movie_id = ? ORDER BY sort_order ASC, episode_number ASC', [movie.id]);
    movie.episodes = episodes;
    return movie;
  }

  async upsertMovieFromSource(movieData) {
    const { source, sourceSlug, slug, title, originalTitle, description, posterUrl, thumbnailUrl, year, quality, language, currentEpisode, totalEpisodes } = movieData;
    
    const existing = await this.findBySourceSlug(source, sourceSlug);
    
    if (existing) {
      await pool.query(
        `UPDATE movies 
         SET title=?, origin_name=?, description=?, poster_url=?, thumb_url=?, year=?, quality=?, language=?, current_episode=?, total_episodes=?, last_synced_at=NOW() 
         WHERE id=?`,
        [title, originalTitle, description, posterUrl, thumbnailUrl, year, quality, language, currentEpisode, totalEpisodes, existing.id]
      );
      return existing.id;
    } else {
      const [result] = await pool.query(
        `INSERT INTO movies (source, source_slug, slug, title, origin_name, description, poster_url, thumb_url, year, quality, language, current_episode, total_episodes, last_synced_at, view) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`,
        [source, sourceSlug, slug, title, originalTitle, description, posterUrl, thumbnailUrl, year, quality, language, currentEpisode, totalEpisodes]
      );
      return result.insertId;
    }
  }

  async findAllMovies({ page = 1, limit = 24, search = '' }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT id, title, description, poster_url, posterUrl, age_limit, original_title, originalTitle, release_year, year, duration, is_series, trailer_url, imdb_rating, quality, created_at FROM movies';
    let params = [];
    if (search) {
      query += ' WHERE title LIKE ? OR original_title LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM movies';
    let countParams = [];
    if (search) {
      countQuery += ' WHERE title LIKE ? OR original_title LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const [countRows] = await pool.query(countQuery, countParams);
    
    return {
      items: rows,
      totalItems: countRows[0].total,
      totalPages: Math.ceil(countRows[0].total / limit)
    };
  }
}

module.exports = new MovieRepository();
