export default async function handler(req, res) {
  // 1) Solo aceptamos método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se acepta método POST' });
  }

  // 2) Extraer datos del cuerpo
  const { email, couponCode } = req.body;
  if (!email || !couponCode) {
    return res.status(400).json({ error: 'Faltan los campos email o couponCode.' });
  }

  // 3) URL del Apps Script
  const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwmrNU0gJUYa0Tu1KsUkJHEKovfymB9aMajCU0Xb1-80JzDn6GAUVLEo3puUc1m_09P_w/exec";

  try {
    // 4) Enviamos petición a Apps Script
    const response = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, couponCode })
    });

    // 5) Intentamos extraer JSON
    const data = await response.json();

    // 6) Si devuelve error explícito desde el GAS
    if (data.error) {
      console.error("🛑 Error recibido desde Apps Script:", data.error);
      return res.status(500).json({ error: data.error });
    }

    // 7) Devolvemos estado
    return res.status(200).json({ already: data.already || false });

  } catch (err) {
    console.error("🚨 Error de conexión con Apps Script:", err);
    return res.status(500).json({ error: "Error al conectar con Google Sheets." });
  }
}
