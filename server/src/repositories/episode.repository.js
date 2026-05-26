const pool = require('../db/pool');

class EpisodeRepository {
  async replaceEpisodesForSource(movieId, source, episodes) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Xóa tập cũ của nguồn này
      await connection.query('DELETE FROM episodes WHERE movie_id = ? AND source = ?', [movieId, source]);

      // Thêm tập mới
      if (episodes && episodes.length > 0) {
        const values = episodes.map(ep => [
          movieId,
          ep.name,
          ep.videoUrl || '', // old column video_url
          ep.source,
          ep.sourceEpisodeSlug,
          ep.serverName,
          ep.embedUrl,
          ep.sortOrder,
          new Date()
        ]);

        await connection.query(
          `INSERT INTO episodes (movie_id, episode, video_url, source, source_episode_slug, server_name, embed_url, sort_order, last_synced_at) 
           VALUES ?`,
          [values]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findByMovieId(movieId) {
    const [rows] = await pool.query('SELECT * FROM episodes WHERE movie_id = ? ORDER BY sort_order ASC', [movieId]);
    return rows;
  }
}

module.exports = new EpisodeRepository();
