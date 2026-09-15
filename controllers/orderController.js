import * as orderModel from '../models/orderModel.js';
import * as customerModel from '../models/customerModel.js';

export async function placeOrder(req, res) {
  try {
    const { items, notes } = req.body;
    const customerId = req.params.customerId; 

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customer-id in URL path parameter' });
    }

    const order = await orderModel.createOrder({ customer_id: customerId, items, notes });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateOrder(req, res) {
  try {
    const orderId = req.params.orderId;

    const { orderId: _bodyOrderId, ...changes } = req.body;

    const updated = await orderModel.updateOrder(orderId, changes);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteOrder(req, res) {
  try {
    const orderId = req.params.orderId;

    const deleted = await orderModel.deleteOrder(orderId);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (err) {
    console.error("deleteOrder error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
export async function listOrders(req, res) {
  try {
    const customerId = req.params.customerId;
    const customer = await customerModel.getCustomerById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const orders = await orderModel.listOrders({ customer_id: customer.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}