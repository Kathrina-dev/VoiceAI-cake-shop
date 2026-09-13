import fetch from 'node-fetch';

async function test() {
  const payload = {
    items: [
      { cake_name: 'Black Forest Cake', quantity: 1 },
      { cake_name: 'Strawberry Cake', quantity: 1 }
    ],
    notes: 'Please include candles'
  };

  const res = await fetch('http://localhost:3000/api/orders/e52eaf0d-cb4e-40a2-aaf6-725cebdcb96c', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
}

test();
