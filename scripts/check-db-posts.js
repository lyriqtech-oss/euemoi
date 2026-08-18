const { Client } = require('pg');

const projectRef = 'ttlwjgzfxvsfcitqvway';
const password = 'cb5MNqJOGidB2Y6B';
const host = 'aws-0-us-east-1.pooler.supabase.com';

const client = new Client({
  connectionString: `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Buscando posts cadastrados no Supabase...');
    const res = await client.query('SELECT id, title, slug, type, status, author_id, created_at FROM posts');
    console.log('Posts no banco de dados:');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Erro ao ler posts:', err.message || err);
  } finally {
    await client.end();
  }
}

run();
