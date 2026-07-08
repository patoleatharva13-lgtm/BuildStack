import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Sparkles } from 'lucide-react'
import { bugsApi, projectsApi } from '../api/crud'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { explainBug } from '../api/groq'
import { sendBugAlert } from '../api/email'
import { useAuth } from '../context/AuthContext'
import ReactMarkdown from 'react-markdown'

const EMPTY = { project_id:'', title:'', description:'', steps:'', expected:'', actual:'', severity:'medium', status:'open', assignee:'' }

export default function BugsPage() {
  const { user } = useAuth()
  const [items,setItems]=useState([]); const [projects,setProjects]=useState([])
  const [open,setOpen]=useState(false); const [form,setForm]=useState(EMPTY); const [editId,setEditId]=useState(null)
  const [aiOpen,setAiOpen]=useState(false); const [aiText,setAiText]=useState(''); const [aiOut,setAiOut]=useState(''); const [aiLoad,setAiLoad]=useState(false)
  const [mailStatus,setMailStatus]=useState({ type:'idle', message:'' }); const [mailLoading,setMailLoading]=useState(false)

  const load = async () => { setItems(await bugsApi.list()); setProjects(await projectsApi.list()) }
  useEffect(()=>{ load() },[])
  const save = async e => {
    e.preventDefault()

    if (editId) {
      await bugsApi.update(editId, form)
    } else {
      const createdBug = await bugsApi.create(form)
      const isOpenBug = createdBug?.status !== 'resolved'

      if (isOpenBug) {
        const email = import.meta.env.VITE_RESEND_TO || 'patole.atharva13@gmail.com'
        await sendBugAlert({ to: email, bugCount: 1 })
      }
    }

    setOpen(false); setForm(EMPTY); setEditId(null)
    await load()
  }
  const edit = it => { setEditId(it.id); setForm(it); setOpen(true) }
  const del = async id => { if (confirm('Delete bug?')) { await bugsApi.remove(id); load() } }
  const runAI = async () => { setAiLoad(true); setAiOut(''); try { setAiOut(await explainBug(aiText)) } catch(e){ setAiOut('Error: '+e.message) } setAiLoad(false) }
  const sendTestMail = async () => {
    setMailLoading(true); setMailStatus({ type:'idle', message:'' })
    try {
      const recipient = import.meta.env.VITE_RESEND_TO || user?.email || 'patole.atharva13@gmail.com'
      const result = await sendBugAlert({ to: recipient, bugCount: 0 })
      setMailStatus({
        type: result.success ? 'success' : 'error',
        message: result.success ? `Test email sent to ${recipient}.` : result.message,
      })
    } catch (error) {
      setMailStatus({ type:'error', message: error.message || 'Unable to send test email.' })
    } finally {
      setMailLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Bug Tracker</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <button className="btn-secondary" onClick={sendTestMail} disabled={mailLoading}>{mailLoading ? 'Sending…' : 'Send test mail'}</button>
          <button className="btn-secondary" onClick={()=>setAiOpen(true)}><Sparkles size={16}/> AI Bug Explainer</button>
          <button className="btn-primary" onClick={()=>{ setEditId(null); setForm({ ...EMPTY, project_id:projects[0]?.id||'' }); setOpen(true) }} disabled={!projects.length}><Plus size={16}/> New bug</button>
        </div>
      </div>
      {mailStatus.message && <div className={`text-sm ${mailStatus.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{mailStatus.message}</div>}
      {!projects.length && <div className="text-sm text-slate-500">Create a project first.</div>}
      {items.length===0 ? <EmptyState title="No bugs logged" subtitle="Add your first bug report."/> :
        <div className="card divide-y">
          {items.map(b => (
            <div key={b.id} className="p-4 flex items-start justify-between hover:bg-slate-50">
              <div className="flex-1">
                <div className="flex items-center gap-2"><h3 className="font-medium">{b.title}</h3><Badge value={b.severity}/><Badge value={b.status}/></div>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{b.description}</p>
                <div className="text-xs text-slate-400 mt-1">Assignee: {b.assignee||'—'}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={()=>edit(b)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={14}/></button>
                <button onClick={()=>del(b.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>}

      <Modal open={open} onClose={()=>setOpen(false)} title={editId?'Edit bug':'New bug'}
        footer={<><button className="btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button form="bf" className="btn-primary">{editId?'Save':'Create'}</button></>}>
        <form id="bf" onSubmit={save} className="space-y-3">
          <div><label className="label">Project</label>
            <select required className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})}>
              <option value="">Select project…</option>
              {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>
          <div><label className="label">Title *</label><input required className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><label className="label">Description</label><textarea rows={2} className="input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div><label className="label">Steps to reproduce</label><textarea rows={2} className="input" value={form.steps} onChange={e=>setForm({...form,steps:e.target.value})}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Expected</label><textarea rows={2} className="input" value={form.expected} onChange={e=>setForm({...form,expected:e.target.value})}/></div>
            <div><label className="label">Actual</label><textarea rows={2} className="input" value={form.actual} onChange={e=>setForm({...form,actual:e.target.value})}/></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Severity</label>
              <select className="input" value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}>
                <option>low</option><option>medium</option><option>high</option><option>critical</option></select></div>
            <div><label className="label">Status</label>
              <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option>open</option><option>in progress</option><option>resolved</option></select></div>
            <div><label className="label">Assignee</label><input className="input" value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})}/></div>
          </div>
        </form>
      </Modal>

      <Modal open={aiOpen} onClose={()=>setAiOpen(false)} title="AI Bug Explainer (Groq)"
        footer={<><button className="btn-secondary" onClick={()=>setAiOpen(false)}>Close</button><button className="btn-primary" onClick={runAI} disabled={!aiText||aiLoad}>{aiLoad?'Thinking…':'Explain'}</button></>}>
        <textarea rows={4} className="input font-mono text-xs" placeholder="Paste an error / stack trace…" value={aiText} onChange={e=>setAiText(e.target.value)}/>
        {aiOut && <div className="prose prose-sm max-w-none border rounded p-3 bg-slate-50"><ReactMarkdown>{aiOut}</ReactMarkdown></div>}
      </Modal>
    </div>
  )
}
