import { Link } from 'react-router-dom'
import { Sparkles, Bug, Map, BarChart3, Users, Rocket, Github, Check } from 'lucide-react'

const features = [
  { icon: Sparkles, title: 'AI Documentation', desc: 'Generate READMEs, docs and specs with Groq LLMs in seconds.' },
  { icon: Bug,      title: 'Bug Tracking',     desc: 'Log, triage and squash bugs — AI explains errors for you.' },
  { icon: Map,      title: 'Roadmap Planning', desc: 'Milestones with progress, deadlines and priorities.' },
  { icon: BarChart3,title: 'Analytics',        desc: 'Visualize progress with interactive charts.' },
  { icon: Users,    title: 'Team Collaboration',desc: 'Invite teammates by email, assign roles and tasks.' },
  { icon: Rocket,   title: 'Release Management',desc: 'Ship versions with changelogs and a release timeline.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white grid place-items-center font-bold">B</div>
          <span className="font-bold text-xl">BuildStack</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/signup" className="btn-primary">Start Free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-medium bg-brand-50 text-brand-700 px-3 py-1 rounded-full">
          <Sparkles size={14}/> Now with AI-powered bug explainer
        </span>
        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Build software <span className="text-brand-600">smarter.</span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          Manage projects, bugs, documentation, AI writing and team collaboration from one beautiful workspace.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/signup" className="btn-primary px-6 py-3 text-base">Start Free</Link>
          <a href="#features" className="btn-secondary px-6 py-3 text-base">See Features</a>
        </div>
        {/* Mock dashboard */}
        <div className="mt-16 mx-auto max-w-5xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-white">
          <div className="h-8 flex items-center gap-1.5 px-3 bg-slate-100 border-b">
            <span className="w-3 h-3 rounded-full bg-red-400"/><span className="w-3 h-3 rounded-full bg-yellow-400"/><span className="w-3 h-3 rounded-full bg-green-400"/>
          </div>
          <div className="grid grid-cols-4 gap-4 p-6">
            {[['Projects','12'],['Open Bugs','25'],['Features Done','83'],['Releases','7']].map(([l,v])=>(
              <div key={l} className="bg-white border border-slate-200 rounded-xl p-4 text-left">
                <div className="text-xs text-slate-500">{l}</div>
                <div className="text-2xl font-bold mt-1">{v}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 px-6 pb-6">
            <div className="col-span-2 h-40 bg-white border rounded-xl p-4 text-left">
              <div className="text-sm font-medium mb-3">Weekly Activity</div>
              <div className="flex items-end gap-2 h-24">
                {[40,60,35,80,55,70,90].map((h,i)=><div key={i} style={{height:`${h}%`}} className="flex-1 bg-brand-500 rounded-t"/>)}
              </div>
            </div>
            <div className="h-40 bg-white border rounded-xl p-4 text-left">
              <div className="text-sm font-medium mb-3">Bug Distribution</div>
              <div className="w-24 h-24 mx-auto rounded-full" style={{background:'conic-gradient(#3b62f6 0 40%, #f59e0b 40% 70%, #10b981 70% 100%)'}}/>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Everything in one workspace</h2>
          <p className="text-center text-slate-600 mt-3 max-w-2xl mx-auto">Stop juggling six different tools. BuildStack replaces them all.</p>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card p-6 hover:shadow-md transition">
                <div className="w-11 h-11 rounded-lg bg-brand-100 text-brand-700 grid place-items-center mb-4"><f.icon size={22}/></div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-slate-600 mt-1.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Loved by builders</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            ['“Finally one place instead of six tabs.”','Priya S.','Full-stack dev'],
            ['“The AI bug explainer saved my week.”','Rahul K.','Indie hacker'],
            ['“Best-looking project tool I have used.”','Neha M.','Engineering lead'],
          ].map(([q,n,r])=>(
            <div key={n} className="card p-6">
              <p className="text-slate-700">{q}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center font-bold">{n[0]}</div>
                <div><div className="font-medium text-sm">{n}</div><div className="text-xs text-slate-500">{r}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Simple pricing</h2>
          <p className="text-slate-600 mt-3">Free forever for individual builders.</p>
          <div className="mt-10 grid md:grid-cols-2 gap-6 text-left">
            <div className="card p-8">
              <div className="text-sm font-medium text-slate-500">Free</div>
              <div className="mt-2 text-4xl font-bold">₹0<span className="text-base font-normal text-slate-500">/mo</span></div>
              <ul className="mt-6 space-y-2 text-sm">
                {['Unlimited projects','AI documentation','Bug tracking','Analytics dashboard'].map(x=>(
                  <li key={x} className="flex gap-2 items-center"><Check size={16} className="text-green-600"/> {x}</li>
                ))}
              </ul>
              <Link to="/signup" className="btn-primary w-full justify-center mt-6">Get started</Link>
            </div>
            <div className="card p-8 border-brand-500 border-2">
              <div className="text-sm font-medium text-brand-600">Pro (soon)</div>
              <div className="mt-2 text-4xl font-bold">₹499<span className="text-base font-normal text-slate-500">/mo</span></div>
              <ul className="mt-6 space-y-2 text-sm">
                {['Everything in Free','Priority AI models','Team seats','Advanced analytics'].map(x=>(
                  <li key={x} className="flex gap-2 items-center"><Check size={16} className="text-green-600"/> {x}</li>
                ))}
              </ul>
              <button className="btn-secondary w-full justify-center mt-6" disabled>Coming soon</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center">FAQ</h2>
        <div className="mt-10 space-y-4">
          {[
            ['Is BuildStack free?', 'Yes — all core features are free while in beta.'],
            ['Which AI does it use?', 'Groq LLaMA 3.1 through your own free API key.'],
            ['Where is my data stored?', 'In your own Supabase project — you own it.'],
            ['Can I invite teammates?', 'Yes, via email invitations powered by Resend.'],
          ].map(([q,a])=>(
            <details key={q} className="card p-5 group">
              <summary className="font-medium cursor-pointer flex justify-between">{q}<span className="text-slate-400 group-open:rotate-45 transition">+</span></summary>
              <p className="mt-2 text-sm text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>© {new Date().getFullYear()} BuildStack</div>
          <div className="flex gap-6">
            <a href="#">Documentation</a><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a>
            <a href="#" className="flex items-center gap-1"><Github size={14}/> GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
