import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projectsApi, milestonesApi, featuresApi, bugsApi, releasesApi } from '../api/crud'
import Badge from '../components/ui/Badge'
import { ArrowLeft, Map, Sparkles, Bug, Rocket } from 'lucide-react'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [p,setP]=useState(null); const [ms,setMs]=useState([]); const [f,setF]=useState([]); const [b,setB]=useState([]); const [r,setR]=useState([])
  useEffect(()=>{ (async () => {
    setP(await projectsApi.get(id))
    setMs((await milestonesApi.list({project_id:id})))
    setF((await featuresApi.list({project_id:id})))
    setB((await bugsApi.list({project_id:id})))
    setR((await releasesApi.list({project_id:id})))
  })() },[id])

  if (!p) return <div className="text-slate-500">Loading…</div>
  return (
    <div className="space-y-6">
      <Link to="/projects" className="text-sm text-slate-500 flex items-center gap-1 hover:text-brand-600"><ArrowLeft size={14}/> Back to projects</Link>
      <div className="card p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{p.name}</h1>
            <p className="text-slate-500 mt-1">{p.description}</p>
          </div>
          <div className="flex gap-2"><Badge value={p.status}/><Badge value={p.priority}/></div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">{(p.tech_stack||[]).map(t=><span key={t} className="badge bg-slate-100 text-slate-600">{t}</span>)}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Section icon={Map} title="Roadmap" count={ms.length} items={ms.slice(0,5).map(x=>x.title)}/>
        <Section icon={Sparkles} title="Features" count={f.length} items={f.slice(0,5).map(x=>x.title)}/>
        <Section icon={Bug} title="Bugs" count={b.length} items={b.slice(0,5).map(x=>x.title)}/>
        <Section icon={Rocket} title="Releases" count={r.length} items={r.slice(0,5).map(x=>`v${x.version}`)}/>
      </div>
    </div>
  )
}
function Section({ icon:Icon, title, count, items }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3"><h3 className="font-semibold flex items-center gap-2"><Icon size={16}/> {title}</h3><span className="text-2xl font-bold">{count}</span></div>
      <ul className="text-sm text-slate-600 space-y-1">
        {items.length===0 && <li className="text-slate-400 text-xs">None yet.</li>}
        {items.map((t,i)=><li key={i}>· {t}</li>)}
      </ul>
    </div>
  )
}
