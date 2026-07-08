// Serverless function for sending email invitations via Resend.
// Deploy on Vercel / Netlify Functions. During local dev, run `vercel dev`
// (npm i -g vercel) so /api/resend/emails is reachable at http://localhost:3000.
// If you only run `npm run dev`, invitations will be simulated in the UI.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { to, subject, html } = req.body || {}
    if (!to || !subject || !html) return res.status(400).json({ error: 'Missing fields' })
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev', to: [to], subject, html }),
    })
    const data = await r.json()
    if (!r.ok) return res.status(r.status).json(data)
    return res.status(200).json(data)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
