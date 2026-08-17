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

const biography = `Natália Mello é professora de Língua Portuguesa e Literatura, nascida e residente no Brasil. Sob o pseudônimo literário **Eu e Moi**, encontra a distância exata necessária para transformar suas vivências e reflexões íntimas em narrativas universais.

Sua escrita navega pelas margens da memória, pelas miudezas do cotidiano que costumam passar despercebidas e pela densidade do que silenciamos. O pseudônimo "Eu e Moi" surgiu do desejo de representar essa dualidade constante que habita todo escritor: o eu que vive as pressões e belezas do dia a dia, e o "moi" que se desliga para observar, recortar e registrar no papel o que resta do tempo.

Atualmente, concilia a docência na educação básica com oficinas de escrita criativa e a produção constante de seus próprios textos literários. Acredita que ler e escrever são as formas mais cruas e bonitas de permanecermos vivos.`;

const shortBio = "Professora de Português e escritora. Colecionadora de miudezas cotidianas, investiga a memória e o tempo através da palavra escrita.";
const heroPhrase = "Entre palavras, silêncios e aquilo que permanece.";

async function run() {
  try {
    console.log('Conectando ao banco de dados do Supabase para atualizar perfil...');
    await client.connect();
    
    // Clear old profile rows to prevent conflict
    await client.query("DELETE FROM author_profile;");

    // Insert updated profile
    const query = `
      INSERT INTO author_profile (id, name, pseudonym, biography, short_bio, hero_phrase, photo, signature, instagram, other_social_links)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const values = [
      'd7b21e84-18be-4054-9cf9-7e3e9d8b7244',
      'Natália Mello',
      'Eu e Moi',
      biography,
      shortBio,
      heroPhrase,
      '/natalia-bg.jpg',
      '',
      'https://instagram.com/euemoi',
      JSON.stringify([
        { label: "E-mail de Contato", url: "mailto:contato@euemoi.com.br" },
        { label: "Medium", url: "https://medium.com/@euemoi" }
      ])
    ];

    await client.query(query, values);
    console.log('✅ Sucesso! O perfil da autora foi atualizado no banco de dados com a foto e a biografia.');
  } catch (err) {
    console.error('❌ Erro ao atualizar perfil no banco de dados:', err.message || err);
  } finally {
    await client.end();
  }
}

run();
