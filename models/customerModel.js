import supabase from './db.js';

export async function createCustomer(payload) {
  const { data, error } = await supabase.from('customers').insert([payload]).select().limit(1).single();
  if (error) throw error;
  return data;
}

export async function getCustomerById(id) {
  const { data, error } = await supabase.from('customers').select('*').eq('id', id).limit(1).single();
  if (error) throw error;
  return data;
}
