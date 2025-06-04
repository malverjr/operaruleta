import https from 'https';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, couponCode } = req.body;
  if (!email || !couponCode) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwmNU0gJUYa0Tu1KsWJkJHEKovfymB9aMajCU0Xb1-80JzDn6GAUVLEo3puUc1m_09P_w/exec';

  const payload = JSON.stringify({ email, couponCode });

  const url = new URL(SHEETS_WEBAPP_URL);

  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const request = https.request(options, response => {
    let data = '';
    response.on('data', chunk => { data += chunk; });
    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          return res.status(500).json({ error: parsed.error });
        }
        return res.status(200).json({ already: parsed.already || false });
      } catch (err) {
        return res.status(500).json({ error: 'Respuesta inválida del servidor de Sheets.' });
      }
    });
  });

  request.on('error', (err) => {
    console.error('❌ Error HTTPS:', err);
    return res.status(500).json({ error: 'Error de conexión con Google Sheets' });
  });

  request.write(payload);
  request.end();
}
