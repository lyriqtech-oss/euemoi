const { Client } = require('pg');

const projectRef = 'ttlwjgzfxvsfcitqvway';
const password = 'cb5MNqJOGidB2Y6B';
const host = 'aws-0-us-east-1.pooler.supabase.com';

const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function test() {
  try {
    console.log('Conectando ao banco de dados do Supabase...');
    await client.connect();
    
    console.log('Testando inserção de post do tipo "cronica"...');
    try {
      const res1 = await client.query(`
        INSERT INTO posts (id, title, slug, excerpt, content, type, status, author_id)
        VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c61', 'Teste Cronica', 'teste-cronica-db', 'Excerpt', 'Content', 'cronica', 'published', 'd7b21e84-18be-4054-9cf9-7e3e9d8b7244')
        ON CONFLICT (id) DO NOTHING
        RETURNING *
      `);
      console.log('✅ Inserção de "cronica" bem-sucedida!', res1.rows[0] ? 'Registro criado.' : 'Ignorado (já existia).');
    } catch (e) {
      console.error('❌ Falha ao inserir "cronica":', e.message || e);
    }

    console.log('Testando inserção de post do tipo "poesia"...');
    try {
      const res2 = await client.query(`
        INSERT INTO posts (id, title, slug, excerpt, content, type, status, author_id)
        VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c62', 'Teste Poesia', 'teste-poesia-db', 'Excerpt', 'Content', 'poesia', 'published', 'd7b21e84-18be-4054-9cf9-7e3e9d8b7244')
        ON CONFLICT (id) DO NOTHING
        RETURNING *
      `);
      console.log('✅ Inserção de "poesia" bem-sucedida!', res2.rows[0] ? 'Registro criado.' : 'Ignorado (já existia).');
    } catch (e) {
      console.error('❌ Falha ao inserir "poesia":', e.message || e);
    }

    // Clean up test posts
    await client.query(`
      DELETE FROM posts WHERE slug IN ('teste-cronica-db', 'teste-poesia-db');
    `);
    console.log('Limpeza de posts de teste concluída.');

  } catch (err) {
    console.error('Erro de conexão:', err.message || err);
  } finally {
    await client.end();
  }
}

test();
