const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = trimmed.split('=')[1].trim();
    }
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = trimmed.split('=')[1].trim();
    }
  });
}

console.log('Testing Supabase Connection...');
console.log('Supabase URL:', supabaseUrl);
console.log('Key present:', Boolean(supabaseAnonKey));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBackend() {
  const results = {};

  try {
    // 1. Test Auth service health
    const { data: authData, error: authError } = await supabase.auth.getSession();
    results.auth = {
      status: authError ? 'FAILED' : 'CONNECTED',
      detail: authError ? authError.message : 'Auth service reachable'
    };
  } catch (err) {
    results.auth = { status: 'ERROR', detail: err.message };
  }

  // 2. Test Tables existence (categories, profiles, transactions, budgets, savings_goals)
  const tables = ['profiles', 'categories', 'transactions', 'budgets', 'savings_goals', 'savings_contributions'];
  results.tables = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      if (error) {
        // PostgREST errors: 42P01 means table does not exist
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
          results.tables[table] = { status: 'MISSING', detail: 'Table does not exist in database' };
        } else {
          // If RLS blocked it or table exists with 0 rows, that means table EXISTS and RLS is active!
          results.tables[table] = { status: 'OK', detail: error.message };
        }
      } else {
        results.tables[table] = { status: 'OK', detail: 'Accessible & RLS active' };
      }
    } catch (err) {
      results.tables[table] = { status: 'ERROR', detail: err.message };
    }
  }

  console.log('\n--- CONNECTION RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
}

testBackend();
