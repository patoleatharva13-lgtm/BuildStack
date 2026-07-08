import { useEffect, useState } from 'react'
import { Plus, Trash2, Mail } from 'lucide-react'
import { teamApi, projectsApi } from '../api/crud'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'

const EMPTY = { project_id:'', name:'', email:'', role:'developer', status:'invited' }
export default function TeamPage() {
  const [items,setItems]=useState([]); const [projects,setProjects]=useState([])
  const [open,setOpen]=useState(false); const [form,setForm]=useState(EMPTY)
  const [toast,setToast]=useState('')
  const load = async () => { setItems(await teamApi.list()); setProjects(await projectsApi.list()) }
  useEffect(()=>{ load() },[])
  const save = async e => {
    e.preventDefault()
    const created = await teamApi.create(form)
    setToast(`Added ${created.name || created.email} to the team.`)
    setOpen(false); setForm(EMPTY); load()
    setTimeout(()=>setToast(''), 5000)
  }
  const del = async id => { if (confirm('Remove member?')) { await teamApi.remove(id); load() } }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Team</h1>
        <button className="btn-primary" onClick={()=>{ setForm({...EMPTY, project_id:projects[0]?.id||''}); setOpen(true) }} disabled={!projects.length}><Plus size={16}/> Invite member</button>
      </div>
      {toast && <div className="card p-3 text-sm bg-brand-50 border-brand-200 text-brand-700">{toast}</div>}

      {items.length===0 ? <EmptyState title="No members yet" subtitle="Invite teammates by email."/> :
        <div className="card divide-y">
          {items.map(m=>(
            <div key={m.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white grid place-items-center font-medium">{(m.name||m.email)[0]?.toUpperCase()}</div>
              <div className="flex-1">
                <div className="font-medium">{m.name||m.email}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1"><Mail size={12}/>{m.email}</div>
              </div>
              <Badge value={m.role}/><Badge value={m.status}/>
              <button onClick={()=>del(m.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>}

      <Modal open={open} onClose={()=>setOpen(false)} title="Invite team member"
        footer={<><button className="btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button form="tf" className="btn-primary">Send invite</button></>}>
        <form id="tf" onSubmit={save} className="space-y-3">
          <div><label className="label">Project</label>
            <select required className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})}>
              <option value="">Select…</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><label className="label">Email *</label><input required type="email" className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div><label className="label">Role</label>
            <select className="input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option>owner</option><option>admin</option><option>developer</option><option>tester</option><option>viewer</option>
            </select></div>
        </form>
      </Modal>
    </div>
  )
}
