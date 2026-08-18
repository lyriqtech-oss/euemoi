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
    console.log('Buscando tags cadastradas no Supabase...');
    const res = await client.query('SELECT id, name, slug FROM tags');
    console.log('Tags no banco de dados:');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Erro ao ler tags:', err.message || err);
  } finally {
    await client.end();
  }
}

run();
