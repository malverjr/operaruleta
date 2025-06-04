// /api/check-email.js

export default async function handler(req, res) {
  // 1. Validamos método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 2. Extraemos email y cupón del body
  const { email, couponCode } = req.body;
  if (!email || !couponCode) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  // 3. URL pública del script de Google
  const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwmNU0gJUYa0Tu1KsWkJHEKovfymB9aMajCU0Xb1-80JzDn6GAUVLEo3puUc1m_09P_w/exec';

  try {
    // 4. Enviamos a Apps Script
    const response = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, couponCode })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Error desde Google Script:", data.error);
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json({ already: data.already || false });
  } catch (err) {
    console.error("❌ Error conectando con Apps Script:", err);
    return res.status(500).json({ error: 'Fallo al conectar con Google Sheets.' });
  }
}
