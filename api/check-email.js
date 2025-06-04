export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se acepta método POST' });
  }

  const { email, couponCode } = req.body;
  if (!email || !couponCode) {
    return res.status(400).json({ error: 'Faltan los campos email o couponCode.' });
  }

  const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwmrNUOgJUYa0Tu1KsuKJHEKovfymB9aMajCUOXb1-80JzDnGOAUvLEo3puUc1m_O9P_w/exec";

  try {
    const response = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, couponCode })
    });
    const data = await response.json();

    if (data.error) {
      console.error("🔴 Error desde Apps Script:", data.error);
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json({ already: data.already || false });
  } catch (err) {
    console.error("🔴 Error conectando con Google Sheets:", err);
    return res.status(500).json({ error: 'Error interno al conectar con Sheets.' });
  }
}
