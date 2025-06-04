// /api/check-email.js
const fetch = require('node-fetch'); // ✅ usando require en vez de import

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se acepta método POST' });
  }

  const { email, couponCode } = req.body;
  if (!email || !couponCode) {
    return res.status(400).json({ error: 'Faltan los campos email o couponCode.' });
  }

  const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxhriTndeqlKMxfp4A7R4c2_GCx9Re3h2Tpxp-uaWCTJ4HfGRfiaZxdXZbt7SFt8EXWuw/exec";

  try {
    const response = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, couponCode })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json({ already: data.already });
  }
  catch (err) {
    console.error("Error conectando con Google Sheets:", err);
    return res.status(500).json({ error: 'Error interno al conectar con Sheets.' });
  }
}
