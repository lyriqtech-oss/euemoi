const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const projectRef = 'ttlwjgzfxvsfcitqvway';
const password = 'cb5MNqJOGidB2Y6B';

// List of AWS regions Supabase hosts database poolers on
const regions = [
  'sa-east-1',      // São Paulo (Most likely default for Brazil users)
  'us-east-1',      // N. Virginia
  'us-east-2',      // Ohio
  'us-west-1',      // N. California
  'us-west-2',      // Oregon
  'eu-west-1',      // Ireland
  'eu-central-1',    // Frankfurt
  'ap-southeast-1',  // Singapore
  'ap-northeast-1',  // Tokyo
];

async function run() {
  const sqlPath = path.join(__dirname, '..', 'supabase_migration.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Pesquisando rota de conexão IPv4 com Supabase...');

  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    // Transaction pooler connection string format
    const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;
    
    console.log(`Testando região: ${region} (${host})...`);
    const client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 5000, // 5s timeout per region
    });
    
    try {
      await client.connect();
      console.log(`\n🎉 Conectado com sucesso ao Supabase na região: ${region}!`);
      
      console.log('Executando o script SQL de migração...');
      await client.query(sql);
      console.log('✅ Banco de dados estruturado! Tabelas, índices e RLS configurados.');
      
      await client.end();
      return; // Succeeded, exit script
    } catch (err) {
      console.log(`❌ Região ${region} indisponível. Erro:`, err.message || err);
      try {
        await client.end();
      } catch (e) {}
    }
  }
  
  console.error('\nErro: Não foi possível se conectar a nenhuma região do pooler do Supabase. Verifique a senha e o status do projeto.');
}

run();
