import * as customerModel from '../models/customerModel.js';

export async function createCustomer(req, res) {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'name and phone are required' });

    const payload = { name, email, phone, address };
    const customer = await customerModel.createCustomer(payload);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCustomer(req, res) {
  try {
    const identifier = req.params.phoneNumber;
    console.log('[DEBUG GET /api/customers/:phoneNumber] Requested Phone:', identifier);

    const customer = await customerModel.findCustomerbyPhoneNumber(identifier);
    console.log('[DEBUG GET /api/customers/:phoneNumber] DB Result:', customer);

    if (!customer) {
      console.log('[DEBUG GET] Returning 404');
      return res.status(404).json({ error: 'Customer not found' });
    }

    console.log('[DEBUG GET] Returning 200 Payload:', customer);
    res.json(customer);
  } catch (err) {
    console.error('[DEBUG GET Error]:', err.message);
    res.status(500).json({ error: err.message });
  }
}
