import supabase from './db.js';

export async function listCakes() {
  const { data, error } = await supabase.from('cakes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCakeByName(name) {
  const { data, error } = await supabase.from('cakes').select('*').ilike('name', name).limit(1);
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[0];
}

export async function createCake(payload) {
  const { data, error } = await supabase.from('cakes').insert([payload]).select().limit(1).single();
  if (error) throw error;
  return data;
}
