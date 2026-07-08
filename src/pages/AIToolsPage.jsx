import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { explainBug, writeFeature, generateReadme, commitMessage } from '../api/groq'

function Tool({ title, placeholder, run }) {
  const [text,setText]=useState(''); const [out,setOut]=useState(''); const [load,setLoad]=useState(false)
  return (
    <div className="card p-5">
      <h3 className="font-semibold flex items-center gap-2"><Sparkles size={16} className="text-brand-600"/>{title}</h3>
      <textarea rows={4} className="input mt-3 font-mono text-xs" placeholder={placeholder} value={text} onChange={e=>setText(e.target.value)}/>
      <button className="btn-primary mt-3" disabled={!text||load} onClick={async ()=>{ setLoad(true); setOut(''); try { setOut(await run(text)) } catch(e){ setOut('Error: '+e.message) } setLoad(false) }}>
        {load?'Thinking…':'Generate'}
      </button>
      {out && <div className="prose prose-sm max-w-none mt-4 border rounded-lg p-3 bg-slate-50"><ReactMarkdown>{out}</ReactMarkdown></div>}
    </div>
  )
}

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Tools</h1>
        <p className="text-sm text-slate-500">Powered by Groq — needs <code>VITE_GROQ_API_KEY</code> in your .env.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Tool title="Bug Explainer" placeholder="Paste an error message or stack trace…" run={explainBug}/>
        <Tool title="Feature Writer" placeholder="e.g. Add dark mode" run={writeFeature}/>
        <Tool title="README Generator" placeholder="Comma separated stack: React, Supabase, Vite" run={generateReadme}/>
        <Tool title="Commit Message" placeholder={`Added login page\nfixed navbar\ncreated dashboard`} run={commitMessage}/>
      </div>
    </div>
  )
}
