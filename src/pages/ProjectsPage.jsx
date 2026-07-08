import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { projectsApi } from '../api/crud'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'

const EMPTY = { name:'', description:'', category:'Web App', tech_stack:[], status:'active', priority:'medium', color:'blue' }

export default function ProjectsPage() {
  const [items,setItems]=useState([]); const [open,setOpen]=useState(false); const [form,setForm]=useState(EMPTY); const [editId,setEditId]=useState(null)
  const load = () => projectsApi.list().then(setItems).catch(console.error)
  useEffect(()=>{ load() },[])

  const save = async e => {
    e.preventDefault()
    const payload = { ...form, tech_stack: (Array.isArray(form.tech_stack)?form.tech_stack:String(form.tech_stack).split(',').map(s=>s.trim()).filter(Boolean)) }
    if (editId) await projectsApi.update(editId, payload); else await projectsApi.create(payload)
    setOpen(false); setForm(EMPTY); setEditId(null); load()
  }
  const edit = it => { setEditId(it.id); setForm({ ...it, tech_stack:(it.tech_stack||[]).join(', ') }); setOpen(true) }
  const del  = async id => { if (confirm('Delete this project?')) { await projectsApi.remove(id); load() } }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button className="btn-primary" onClick={()=>{ setEditId(null); setForm(EMPTY); setOpen(true) }}><Plus size={16}/> New project</button>
      </div>

      {items.length===0 ? <EmptyState title="No projects yet" subtitle="Create your first project to start planning."/> :
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(p => (
            <div key={p.id} className="card p-5 flex flex-col">
              <div className="flex justify-between items-start">
                <Link to={`/projects/${p.id}`} className="font-semibold text-lg hover:text-brand-600">{p.name}</Link>
                <div className="flex gap-1">
                  <button onClick={()=>edit(p)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={14}/></button>
                  <button onClick={()=>del(p.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={14}/></button>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(p.tech_stack||[]).map(t=><span key={t} className="badge bg-slate-100 text-slate-600">{t}</span>)}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t"><Badge value={p.status}/><Badge value={p.priority}/><span className="text-xs text-slate-400 ml-auto">{p.category}</span></div>
            </div>
          ))}
        </div>}

      <Modal open={open} onClose={()=>setOpen(false)} title={editId?'Edit project':'New project'}
        footer={<><button className="btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button form="pf" className="btn-primary">{editId?'Save':'Create'}</button></>}>
        <form id="pf" onSubmit={save} className="space-y-3">
          <div><label className="label">Name *</label><input required className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><label className="label">Description</label><textarea rows={3} className="input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                <option>Web App</option><option>Mobile App</option><option>API</option><option>Library</option><option>Other</option>
              </select></div>
            <div><label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                <option>low</option><option>medium</option><option>high</option><option>critical</option>
              </select></div>
          </div>
          <div><label className="label">Tech stack (comma separated)</label>
            <input className="input" value={Array.isArray(form.tech_stack)?form.tech_stack.join(', '):form.tech_stack} onChange={e=>setForm({...form,tech_stack:e.target.value})} placeholder="React, Supabase, Vite"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Status</label>
              <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option>active</option><option>paused</option><option>completed</option>
              </select></div>
            <div><label className="label">Color</label>
              <select className="input" value={form.color} onChange={e=>setForm({...form,color:e.target.value})}>
                <option>blue</option><option>green</option><option>purple</option><option>orange</option><option>red</option>
              </select></div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
