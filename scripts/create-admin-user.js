const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ttlwjgzfxvsfcitqvway.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bHdqZ3pmeHZzZmNpdHF2d2F5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njk4OTkwMCwiZXhwIjoyMTAyNTY1OTAwfQ.OwQ0RzZyr8WuNB_NwH85Q-PpE6Ery8j-DGDh1N4whEY';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  try {
    console.log('Conectando ao Supabase Auth via Admin API...');
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@euemoi.com.br',
      password: 'admin123',
      email_confirm: true // Confirm email automatically so they can login immediately
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        console.log('✅ O usuário administrador (admin@euemoi.com.br) já está cadastrado no Supabase Auth!');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Usuário administrador criado com sucesso no seu Supabase Auth!');
      console.log('E-mail: admin@euemoi.com.br');
      console.log('Senha: admin123');
    }
  } catch (err) {
    console.error('❌ Erro ao criar usuário no Supabase Auth:', err.message || err);
  }
}

run();
