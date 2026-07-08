// Serverless function for sending email notifications via Resend.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    let payload = req.body

    if (typeof payload === 'string') {
      payload = JSON.parse(payload)
    } else if (!payload && req.readable) {
      const chunks = []
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      }
      payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    }

    const { to, subject, html, from } = payload || {}
    if (!to || !subject || !html) return res.status(400).json({ error: 'Missing fields' })

    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'RESEND_API_KEY is not configured.' })

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: from || process.env.RESEND_FROM_EMAIL || process.env.VITE_RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: [to],
        subject,
        html,
      }),
    })

    const data = await r.json()
    return res.status(r.status).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
