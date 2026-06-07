module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (!body) {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString());
    } catch {
      return res.status(400).json({ ok: false });
    }
  }

  const { password } = body || {};
  if (!password) return res.status(400).json({ ok: false, error: 'Passwort fehlt' });

  if (password === process.env.KUNDEN_PASSWORD) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Falsches Passwort' });
};
