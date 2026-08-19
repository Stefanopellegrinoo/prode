import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // O usa el anon si solo subís imágenes públicas
);

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('teams').select('id').limit(1);

    if (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
      process.exit(1); // Salir del proceso si falla
    } else {
      console.log('✅ Conexión exitosa a Supabase');
    }
  } catch (err) {
    console.error('❌ Error inesperado al conectar a Supabase:', err);
    process.exit(1);
  }
}

testSupabaseConnection() 

export default supabase;
