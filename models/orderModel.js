import supabase from './db.js';
import { getCakeByName } from './cakeModel.js';

async function fetchItemsForOrder(orderId) {
  const { data, error } = await supabase
    .from('order_items')
    .select('*, cakes(*)')
    .eq('order_id', orderId);
  if (error) throw error;
  return data;
}

export async function createOrder(payload) {
  // payload: { customer_id, items: [{ cake_id, quantity }], status, notes }
  const { customer_id, items, status = 'pending', notes = null } = payload;
  if (!items || !Array.isArray(items) || items.length === 0) throw new Error('Order must contain at least one item');

  // calculate prices and total
  const enriched = [];
  let total = 0;
  for (const it of items) {
    const cake = await getCakeByName(it.cake_name);
    if (!cake) throw new Error(`Cake not found: ${it.cake_name}`);
    const unit_price = Number(cake.price);
    const quantity = Number(it.quantity || 1);
    const subtotal = unit_price * quantity;
    total += subtotal;
    enriched.push({ cake_id: cake.id, cake_name: it.cake_name, quantity, unit_price, subtotal });
  }

  const orderPayload = { customer_id, status, total, notes };
  const { data: order, error: orderErr } = await supabase.from('orders').insert([orderPayload]).select().single();
  if (orderErr) throw orderErr;
  const itemsToInsert = enriched.map(i => ({ order_id: order.id, cake_id: i.cake_id, cake_name: i.cake_name, quantity: i.quantity, unit_price: i.unit_price, subtotal: i.subtotal }));
  const { data: insertedItems, error: itemsErr } = await supabase.from('order_items').insert(itemsToInsert).select();
  if (itemsErr) throw itemsErr;

  // attach items with cake details
  const itemsWithCakes = await fetchItemsForOrder(order.id);
  return { ...order, items: itemsWithCakes };
}

export async function updateOrder(id, changes) {
  // changes may include status, notes, items (array to replace)
  changes = changes || {};
  changes.updated_at = new Date().toISOString();

  let newTotal = null;
  if (changes.items) {
    // replace items: delete existing and insert new
    const items = changes.items;
    // calculate new total and enriched items
    const enriched = [];
    let total = 0;
    for (const it of items) {
      const cake = await getCakeByName(it.cake_name);
      if (!cake) throw new Error(`Cake not found: ${it.cake_name}`);
      const cake_name = cake.name;
      const unit_price = Number(cake.price);
      const quantity = Number(it.quantity || 1);
      const subtotal = unit_price * quantity;
      total += subtotal;
      enriched.push({ order_id: id, cake_id: cake.id, cake_name, quantity, unit_price, subtotal });
    }
    newTotal = total;
    // delete old items
    const { error: delErr } = await supabase.from('order_items').delete().eq('order_id', id);
    if (delErr) throw delErr;
    const { error: insErr } = await supabase.from('order_items').insert(enriched);
    if (insErr) throw insErr;
  }

  const updatePayload = { ...changes };
  delete updatePayload.items;
  if (newTotal !== null) updatePayload.total = newTotal;

  const { data, error: updErr } = await supabase.from('orders').update(updatePayload).eq('id', id).select().single();
  if (updErr) throw updErr;
  const items = await fetchItemsForOrder(id);
  return { ...data, items };
}

export async function deleteOrder(id) {
  // deleting order will cascade delete order_items
  const { data, error } = await supabase.from('orders').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function listOrders(filter = {}) {
  // filter: { customer_id }
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (filter.customer_id) query = query.eq('customer_id', filter.customer_id);
  const { data, error } = await query;
  if (error) throw error;
  // attach items for each order
  const results = [];
  for (const o of data) {
    const items = await fetchItemsForOrder(o.id);
    results.push({ ...o, items });
  }
  return results;
}
