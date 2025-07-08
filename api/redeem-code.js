export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST' });
  }

  const { couponCode } = req.body;
  if (!couponCode) {
    return res.status(400).json({ error: 'Falta couponCode' });
  }

  const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/…TU_WEBAPP_ID…/exec";

  try {
    const response = await fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: "redeem", couponCode })
    });
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }
    // data.valid, data.alreadyRedeemed
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Error conectando con Sheets.' });
  }
}
