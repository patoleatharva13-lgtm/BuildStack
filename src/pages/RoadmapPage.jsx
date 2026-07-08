import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { milestonesApi, projectsApi } from '../api/crud'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'

const EMPTY = { project_id:'', title:'', description:'', deadline:'', status:'planned', progress:0, priority:'medium' }
export default function RoadmapPage() {
  const [items,setItems]=useState([]); const [projects,setProjects]=useState([])
  const [open,setOpen]=useState(false); const [form,setForm]=useState(EMPTY); const [editId,setEditId]=useState(null)
  const load = async () => { setItems(await milestonesApi.list()); setProjects(await projectsApi.list()) }
  useEffect(()=>{ load() },[])
  const save = async e => {
    e.preventDefault()
    const payload = { ...form, progress:Number(form.progress||0), deadline: form.deadline||null }
    if (editId) await milestonesApi.update(editId, payload); else await milestonesApi.create(payload)
    setOpen(false); setForm(EMPTY); setEditId(null); load()
  }
  const edit = it => { setEditId(it.id); setForm({...it, deadline:it.deadline||''}); setOpen(true) }
  const del = async id => { if (confirm('Delete milestone?')) { await milestonesApi.remove(id); load() } }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Roadmap</h1>
        <button className="btn-primary" onClick={()=>{ setEditId(null); setForm({...EMPTY, project_id:projects[0]?.id||''}); setOpen(true) }} disabled={!projects.length}><Plus size={16}/> New milestone</button>
      </div>
      {items.length===0 ? <EmptyState title="No milestones" subtitle="Add versions like 1.0, 1.1 …"/> :
      <div className="space-y-3">
        {items.map(m=>(
          <div key={m.id} className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 items-center"><h3 className="font-semibold">{m.title}</h3><Badge value={m.status}/><Badge value={m.priority}/></div>
                <p className="text-sm text-slate-500 mt-1">{m.description}</p>
                <div className="text-xs text-slate-400 mt-1">Due: {m.deadline||'—'}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={()=>edit(m)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={14}/></button>
                <button onClick={()=>del(m.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={14}/></button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Progress</span><span>{m.progress}%</span></div>
              <div className="h-2 bg-slate-100 rounded-full"><div className="h-2 bg-brand-600 rounded-full" style={{width:`${m.progress}%`}}/></div>
            </div>
          </div>
        ))}
      </div>}

      <Modal open={open} onClose={()=>setOpen(false)} title={editId?'Edit milestone':'New milestone'}
        footer={<><button className="btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button form="mf" className="btn-primary">{editId?'Save':'Create'}</button></>}>
        <form id="mf" onSubmit={save} className="space-y-3">
          <div><label className="label">Project</label>
            <select required className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})}>
              <option value="">Select…</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>
          <div><label className="label">Title *</label><input required className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><label className="label">Description</label><textarea rows={2} className="input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Status</label><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>planned</option><option>in progress</option><option>completed</option></select></div>
            <div><label className="label">Priority</label><select className="input" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>low</option><option>medium</option><option>high</option></select></div>
            <div><label className="label">Deadline</label><input type="date" className="input" value={form.deadline||''} onChange={e=>setForm({...form,deadline:e.target.value})}/></div>
          </div>
          <div><label className="label">Progress: {form.progress}%</label>
            <input type="range" min="0" max="100" value={form.progress} onChange={e=>setForm({...form,progress:e.target.value})} className="w-full"/></div>
        </form>
      </Modal>
    </div>
  )
}
