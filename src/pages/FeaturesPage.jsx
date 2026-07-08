import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Sparkles } from 'lucide-react'
import { featuresApi, projectsApi } from '../api/crud'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { writeFeature } from '../api/groq'
import ReactMarkdown from 'react-markdown'

const EMPTY = { project_id:'', title:'', description:'', priority:'medium', deadline:'', assignee:'', tags:[], status:'pending' }

export default function FeaturesPage() {
  const [items,setItems]=useState([]); const [projects,setProjects]=useState([])
  const [open,setOpen]=useState(false); const [form,setForm]=useState(EMPTY); const [editId,setEditId]=useState(null)
  const [aiOpen,setAiOpen]=useState(false); const [aiText,setAiText]=useState(''); const [aiOut,setAiOut]=useState(''); const [aiLoad,setAiLoad]=useState(false)

  const load = async () => { setItems(await featuresApi.list()); setProjects(await projectsApi.list()) }
  useEffect(()=>{ load() },[])
  const save = async e => {
    e.preventDefault()
    const payload = { ...form, tags: Array.isArray(form.tags)?form.tags:String(form.tags).split(',').map(s=>s.trim()).filter(Boolean), deadline: form.deadline||null }
    if (editId) await featuresApi.update(editId, payload); else await featuresApi.create(payload)
    setOpen(false); setForm(EMPTY); setEditId(null); load()
  }
  const edit = it => { setEditId(it.id); setForm({ ...it, tags:(it.tags||[]).join(', '), deadline:it.deadline||'' }); setOpen(true) }
  const del = async id => { if (confirm('Delete feature?')) { await featuresApi.remove(id); load() } }
  const runAI = async () => { setAiLoad(true); setAiOut(''); try { setAiOut(await writeFeature(aiText)) } catch(e){ setAiOut('Error: '+e.message) } setAiLoad(false) }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Features</h1>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={()=>setAiOpen(true)}><Sparkles size={16}/> AI Feature Writer</button>
          <button className="btn-primary" onClick={()=>{ setEditId(null); setForm({ ...EMPTY, project_id:projects[0]?.id||'' }); setOpen(true) }} disabled={!projects.length}><Plus size={16}/> New feature</button>
        </div>
      </div>

      {items.length===0 ? <EmptyState title="No features yet" subtitle="Plan your first feature."/> :
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(f=>(
            <div key={f.id} className="card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-2 items-center"><h3 className="font-semibold">{f.title}</h3><Badge value={f.priority}/><Badge value={f.status}/></div>
                  <p className="text-sm text-slate-500 mt-1">{f.description}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={()=>edit(f)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={14}/></button>
                  <button onClick={()=>del(f.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={14}/></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">{(f.tags||[]).map(t=><span key={t} className="badge bg-brand-50 text-brand-700">#{t}</span>)}</div>
              <div className="text-xs text-slate-400 mt-3">Assignee: {f.assignee||'—'} · Due: {f.deadline||'—'}</div>
            </div>
          ))}
        </div>}

      <Modal open={open} onClose={()=>setOpen(false)} title={editId?'Edit feature':'New feature'}
        footer={<><button className="btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button form="ff" className="btn-primary">{editId?'Save':'Create'}</button></>}>
        <form id="ff" onSubmit={save} className="space-y-3">
          <div><label className="label">Project</label>
            <select required className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})}>
              <option value="">Select project…</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>
          <div><label className="label">Title *</label><input required className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><label className="label">Description</label><textarea rows={3} className="input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Priority</label><select className="input" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>low</option><option>medium</option><option>high</option></select></div>
            <div><label className="label">Status</label><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>pending</option><option>in progress</option><option>completed</option></select></div>
            <div><label className="label">Deadline</label><input type="date" className="input" value={form.deadline||''} onChange={e=>setForm({...form,deadline:e.target.value})}/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Assignee</label><input className="input" value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})}/></div>
            <div><label className="label">Tags (comma sep)</label><input className="input" value={Array.isArray(form.tags)?form.tags.join(', '):form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/></div>
          </div>
        </form>
      </Modal>

      <Modal open={aiOpen} onClose={()=>setAiOpen(false)} title="AI Feature Writer (Groq)"
        footer={<><button className="btn-secondary" onClick={()=>setAiOpen(false)}>Close</button><button className="btn-primary" onClick={runAI} disabled={!aiText||aiLoad}>{aiLoad?'Writing…':'Generate'}</button></>}>
        <input className="input" placeholder="e.g. Add dark mode" value={aiText} onChange={e=>setAiText(e.target.value)}/>
        {aiOut && <div className="prose prose-sm max-w-none border rounded p-3 bg-slate-50"><ReactMarkdown>{aiOut}</ReactMarkdown></div>}
      </Modal>
    </div>
  )
}
