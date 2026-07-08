import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Rocket } from 'lucide-react'
import { releasesApi, projectsApi } from '../api/crud'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'

const EMPTY = { project_id:'', version:'', released_on:new Date().toISOString().slice(0,10), notes:'' }
export default function ReleasesPage() {
  const [items,setItems]=useState([]); const [projects,setProjects]=useState([])
  const [open,setOpen]=useState(false); const [form,setForm]=useState(EMPTY); const [editId,setEditId]=useState(null)
  const load = async () => { setItems(await releasesApi.list()); setProjects(await projectsApi.list()) }
  useEffect(()=>{ load() },[])
  const save = async e => {
    e.preventDefault()
    if (editId) await releasesApi.update(editId, form); else await releasesApi.create(form)
    setOpen(false); setForm(EMPTY); setEditId(null); load()
  }
  const edit = it => { setEditId(it.id); setForm(it); setOpen(true) }
  const del = async id => { if (confirm('Delete release?')) { await releasesApi.remove(id); load() } }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Releases</h1>
        <button className="btn-primary" onClick={()=>{ setEditId(null); setForm({...EMPTY, project_id:projects[0]?.id||''}); setOpen(true) }} disabled={!projects.length}><Plus size={16}/> New release</button>
      </div>
      {items.length===0 ? <EmptyState title="No releases" subtitle="Ship your first version."/> :
        <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
          {items.map(r=>(
            <li key={r.id} className="ml-6">
              <span className="absolute -left-3 w-6 h-6 rounded-full bg-brand-600 text-white grid place-items-center"><Rocket size={12}/></span>
              <div className="card p-5">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">v{r.version}</h3>
                    <div className="text-xs text-slate-400">Released {r.released_on}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={()=>edit(r)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={14}/></button>
                    <button onClick={()=>del(r.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={14}/></button>
                  </div>
                </div>
                <pre className="text-sm text-slate-700 mt-3 whitespace-pre-wrap font-sans">{r.notes}</pre>
              </div>
            </li>
          ))}
        </ol>}

      <Modal open={open} onClose={()=>setOpen(false)} title={editId?'Edit release':'New release'}
        footer={<><button className="btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button form="rf" className="btn-primary">{editId?'Save':'Create'}</button></>}>
        <form id="rf" onSubmit={save} className="space-y-3">
          <div><label className="label">Project</label>
            <select required className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})}>
              <option value="">Select…</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Version *</label><input required className="input" placeholder="1.0.0" value={form.version} onChange={e=>setForm({...form,version:e.target.value})}/></div>
            <div><label className="label">Released on</label><input type="date" className="input" value={form.released_on} onChange={e=>setForm({...form,released_on:e.target.value})}/></div>
          </div>
          <div><label className="label">Changelog</label><textarea rows={6} className="input font-mono text-sm" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
        </form>
      </Modal>
    </div>
  )
}
