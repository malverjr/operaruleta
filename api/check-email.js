// /api/check-email.js

export default async function handler(req, res) {
  // 1) Solo aceptamos método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 2) Leemos los datos del cuerpo
  const { email, couponCode } = req.body;
  if (!email || !couponCode) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // 3) URL pública del Apps Script (Web App)
  const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxhriTndeqlKMxfp4A7R4c2_GCx9Re3h2Tpxp-uaWCTJ4HfGRfiaZxdXZbt7SFt8EXWuw/exec';

  try {
    // 4) Llamada a Google Apps Script
    const response = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, couponCode }),
    });

    const data = await response.json();

    // 5) Si el Apps Script devuelve error
    if (data.error) {
      console.error('⚠️ Error desde Apps Script:', data.error);
      return res.status(500).json({ error: data.error });
    }

    // 6) Todo OK: devolvemos { already: true/false }
    return res.status(200).json({ already: data.already || false });

  } catch (err) {
    console.error('🚨 Error de conexión con Apps Script:', err);
    return res.status(500).json({ error: 'Error interno al conectar con Google Sheets' });
  }
}
