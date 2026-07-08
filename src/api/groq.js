// Groq AI client (frontend). Uses the OpenAI-compatible chat completions endpoint.
// NOTE: Because this runs in the browser your VITE_GROQ_API_KEY is visible to
// end users. That is fine for a personal / demo project — for production, put
// this behind a serverless proxy.
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

async function chat(system, user) {
  const key = import.meta.env.VITE_GROQ_API_KEY
  if (!key) throw new Error('Missing VITE_GROQ_API_KEY in .env')
  const r = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.4,
    }),
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error(`Groq error ${r.status}: ${t}`)
  }
  const data = await r.json()
  return data.choices?.[0]?.message?.content || ''
}

export const explainBug = (errorText) =>
  chat('You are a senior developer. Explain errors in clear structured markdown with sections: What it means, Why it happened, Possible fixes, Example code, Best practices.', errorText)

export const writeFeature = (idea) =>
  chat('You expand feature ideas into a full development task. Return markdown with: Description, Acceptance criteria (bullet list), Edge cases, Implementation steps, Estimated complexity.', idea)

export const generateReadme = (stackList) =>
  chat('You generate high quality README.md files in markdown.', `Generate a README for a project using: ${stackList}. Include Intro, Features, Installation, Environment variables, Folder structure, License.`)

export const commitMessage = (notes) =>
  chat('You write conventional commit messages. Output ONLY the commit message (title line + body bullets). No preamble.', notes)
