// /api/check-email.js

export default async function handler(req, res) {
  // 1) Solo admitimos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se acepta método POST' });
  }

  // 2) Leemos email y couponCode del cuerpo JSON
  const { email, couponCode } = req.body;
  if (!email || !couponCode) {
    return res.status(400).json({ error: 'Faltan los campos email o couponCode.' });
  }

  // 3) URL de tu Apps Script publicada como Web App
  const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxhriTndeqlKMxfp4A7R4c2_GCx9Re3h2Tpxp-uaWCTJ4HfGRfiaZxdXZbt7SFt8EXWuw/exec";

  try {
    // DEBUG: Mostrar qué datos se están enviando a Google Apps Script
    console.log("📤 Enviando a Google Script:", { email, couponCode });

    // 4) Reenviamos la petición (email, couponCode) a Google Sheets
    const response = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, couponCode })
    });

    const data = await response.json(); // { already: true/false } o { error: "mensaje" }

    // DEBUG: Mostrar la respuesta que devuelve el Apps Script
    console.log("📥 Respuesta desde Google Script:", data);

    // 5) Si Apps Script devolvió un error, lo reenviamos
    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    // 6) Devolvemos { already } al navegador
    return res.status(200).json({ already: data.already });
  }
  catch (err) {
    console.error("❌ Error conectando con Google Sheets:", err.message, err.stack);
    return res.status(500).json({ error: 'Error interno al conectar con Sheets.' });
  }
}

