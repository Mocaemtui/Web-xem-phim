const fs = require('fs');
const path = require('path');
const pool = require('./src/db/pool');

async function run() {
  try {
    const filePath = path.join(__dirname, 'src/db/migrations/001_source_normalization.sql');
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split by semicolons
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} statements to execute.`);

    for (let i = 0; i < statements.length; i++) {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      try {
        await pool.query(statements[i]);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_DUP_KEYNAME') {
          console.log(`Skipping (already exists): ${err.message}`);
        } else {
          console.error(`Error executing statement ${i + 1}: ${err.message}`);
          throw err;
        }
      }
    }
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
