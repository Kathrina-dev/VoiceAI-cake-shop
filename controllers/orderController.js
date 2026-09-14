import * as orderModel from '../models/orderModel.js';
import * as customerModel from '../models/customerModel.js';

export async function placeOrder(req, res) {
  try {
    const { customer, items, notes } = req.body;

    let customerId = null;
    if (customer) {
      const existing = customer.phone ? await customerModel.getCustomerById(customer.phone) : null;
      if (existing) {
        customerId = existing.id;
      } else {
        const created = await customerModel.createCustomer(customer);
        customerId = created.id;
      }
    }

    const order = await orderModel.createOrder({ customer_id: customerId, items, notes });
    res.status(201).json({ data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateOrder(req, res) {
  try {
    const id = req.params.id;
    const changes = req.body;
    const updated = await orderModel.updateOrder(id, changes);
    res.json({ data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteOrder(req, res) {
  try {
    const id = req.params.id;
    await orderModel.deleteOrder(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listOrders(req, res) {
  try {
    const id = req.params.id;
    const customer = await customerModel.getCustomerById(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const orders = await orderModel.listOrders({ customer_id: customer.id });
    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}