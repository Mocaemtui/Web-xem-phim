const mysql = require('mysql2/promise');

async function fixImageUrls() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2222',
      database: 'movie_website'
    });

    console.log('Connected to database');

    // Fix bg_url in banners
    const [banners] = await conn.query('SELECT id, bg_url, thumbnails FROM banners');
    for (const banner of banners) {
      let updated = false;
      let newBgUrl = banner.bg_url;
      let newThumbnails = banner.thumbnails;

      // Fix bg_url
      if (newBgUrl && newBgUrl.endsWith('&quot')) {
        newBgUrl = newBgUrl.slice(0, -5);
        updated = true;
      }

      // Fix thumbnails JSON
      if (newThumbnails) {
        try {
          const thumbs = JSON.parse(newThumbnails);
          const fixedThumbs = thumbs.map(url => url.endsWith('&quot') ? url.slice(0, -5) : url);
          if (JSON.stringify(thumbs) !== JSON.stringify(fixedThumbs)) {
            newThumbnails = JSON.stringify(fixedThumbs);
            updated = true;
          }
        } catch (e) {
          console.error('Error parsing thumbnails for banner', banner.id, e.message);
        }
      }

      if (updated) {
        await conn.query(
          'UPDATE banners SET bg_url = ?, thumbnails = ? WHERE id = ?',
          [newBgUrl, newThumbnails, banner.id]
        );
        console.log(`Fixed banner ${banner.id}`);
      }
    }

    // Fix poster_url in movies
    const [movies] = await conn.query('SELECT id, poster_url FROM movies WHERE poster_url LIKE "%&quot%"');
    for (const movie of movies) {
      const newPosterUrl = movie.poster_url.slice(0, -5);
      await conn.query('UPDATE movies SET poster_url = ? WHERE id = ?', [newPosterUrl, movie.id]);
      console.log(`Fixed movie ${movie.id} poster`);
    }

    console.log('Done!');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixImageUrls();
