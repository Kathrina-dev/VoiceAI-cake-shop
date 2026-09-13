import * as customerModel from '../models/customerModel.js';

export async function createCustomer(req, res) {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });

    const payload = { name, email, phone, address };
    const customer = await customerModel.createCustomer(payload);
    res.status(201).json({ data: customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCustomer(req, res) {
  try {
    const identifier = req.params.email;
    const customer = await customerModel.findCustomerByEmail(identifier);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ data: customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
