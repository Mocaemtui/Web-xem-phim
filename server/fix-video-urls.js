const pool = require('./src/db/pool');

async function fixVideoUrls() {
  try {
    console.log('Connecting to database...');
    const connection = await pool.getConnection();
    console.log('Connected successfully');

    // Update localhost video URLs to working sample URLs
    const workingUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
    
    const [result] = await connection.execute(
      `UPDATE episodes SET video_url = ? WHERE video_url LIKE 'http://localhost%'`,
      [workingUrl]
    );
    
    console.log(`Updated ${result.affectedRows} episodes with working video URLs`);
    
    // Update example.com URLs to working sample URLs
    const [result2] = await connection.execute(
      `UPDATE episodes SET video_url = ? WHERE video_url LIKE 'https://example.com%'`,
      [workingUrl]
    );
    
    console.log(`Updated ${result2.affectedRows} episodes with working video URLs`);
    
    connection.release();
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixVideoUrls();
