import * as cakeModel from '../models/cakeModel.js';

export async function listCakes(req, res) {
  try {
    const cakes = await cakeModel.listCakes();
    res.json({ data: cakes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCake(req, res) {
  try {
    const name = req.params.name;
    const cake = await cakeModel.getCakeByName(name);
    if (!cake) return res.status(404).json({ error: 'Cake not found' });
    res.json({ data: cake });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createCake(req, res) {
  try {
    const payload = req.body;
    const cake = await cakeModel.createCake(payload);
    res.status(201).json({ data: cake });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
