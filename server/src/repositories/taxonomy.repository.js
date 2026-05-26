const pool = require('../db/pool');

class TaxonomyRepository {
  constructor(tableName, pivotTableName, fkColumn) {
    this.tableName = tableName;
    this.pivotTableName = pivotTableName;
    this.fkColumn = fkColumn;
  }

  async attachToMovie(movieId, items) {
    if (!items || items.length === 0) return;

    for (const name of items) {
      // Find or create
      let [rows] = await pool.query(`SELECT id FROM ${this.tableName} WHERE name = ?`, [name]);
      let itemId;
      if (rows.length > 0) {
        itemId = rows[0].id;
      } else {
        const [result] = await pool.query(`INSERT INTO ${this.tableName} (name) VALUES (?)`, [name]);
        itemId = result.insertId;
      }

      // Link
      try {
        await pool.query(`INSERT INTO ${this.pivotTableName} (movie_id, ${this.fkColumn}) VALUES (?, ?)`, [movieId, itemId]);
      } catch (err) {
        // Ignore duplicate entry errors
        if (err.code !== 'ER_DUP_ENTRY') throw err;
      }
    }
  }

  async clearForMovie(movieId) {
    await pool.query(`DELETE FROM ${this.pivotTableName} WHERE movie_id = ?`, [movieId]);
  }
}

const genreRepository = new TaxonomyRepository('genres', 'movie_genres', 'genre_id');
const countryRepository = new TaxonomyRepository('countries', 'movie_countries', 'country_id');
const actorRepository = new TaxonomyRepository('actors', 'movie_actors', 'actor_id');
const directorRepository = new TaxonomyRepository('directors', 'movie_directors', 'director_id');

module.exports = {
  genreRepository,
  countryRepository,
  actorRepository,
  directorRepository
};
