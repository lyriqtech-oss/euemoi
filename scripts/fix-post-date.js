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
    console.log('Ajustando a data de publicação do post "CONJUGAÇÃO DO MEDO" no Supabase...');
    
    // Set published_at to the creation date or a few minutes ago in UTC
    const res = await client.query(`
      UPDATE posts 
      SET published_at = created_at - INTERVAL '2 minutes'
      WHERE slug = 'conjugacaodomedo'
      RETURNING id, title, published_at, status
    `);
    
    console.log('Post atualizado com sucesso no banco de dados:');
    console.log(JSON.stringify(res.rows[0], null, 2));
  } catch (err) {
    console.error('Erro ao ajustar data do post:', err.message || err);
  } finally {
    await client.end();
  }
}

run();
