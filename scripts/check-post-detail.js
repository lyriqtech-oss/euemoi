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
    console.log('Buscando detalhes do post no Supabase...');
    const res = await client.query(`
      SELECT id, title, slug, type, status, published_at, created_at 
      FROM posts 
      WHERE slug = 'conjugacaodomedo'
    `);
    console.log('Detalhes do post no banco de dados:');
    console.log(JSON.stringify(res.rows[0], null, 2));
    
    console.log('\nHorário atual do servidor em UTC:', new Date().toISOString());
  } catch (err) {
    console.error('Erro ao ler detalhes do post:', err.message || err);
  } finally {
    await client.end();
  }
}

run();
