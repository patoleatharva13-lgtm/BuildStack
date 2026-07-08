import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { docsApi, projectsApi } from '../api/crud'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import ReactMarkdown from 'react-markdown'

const SECTIONS=['Setup','API','Database','Architecture','Deployment','Notes']
const EMPTY = { project_id:'', section:'Setup', title:'', content:'' }
export default function DocumentationPage() {
  const [items,setItems]=useState([]); const [projects,setProjects]=useState([])
  const [open,setOpen]=useState(false); const [form,setForm]=useState(EMPTY); const [editId,setEditId]=useState(null)
  const [selected,setSelected]=useState(null)
  const load = async () => { setItems(await docsApi.list()); setProjects(await projectsApi.list()) }
  useEffect(()=>{ load() },[])
  const save = async e => {
    e.preventDefault()
    if (editId) await docsApi.update(editId, form); else await docsApi.create(form)
    setOpen(false); setForm(EMPTY); setEditId(null); load()
  }
  const edit = it => { setEditId(it.id); setForm(it); setOpen(true) }
  const del = async id => { if (confirm('Delete document?')) { await docsApi.remove(id); if(selected?.id===id) setSelected(null); load() } }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Documentation</h1>
        <button className="btn-primary" onClick={()=>{ setEditId(null); setForm({...EMPTY, project_id:projects[0]?.id||''}); setOpen(true) }} disabled={!projects.length}><Plus size={16}/> New doc</button>
      </div>
      {items.length===0 ? <EmptyState title="No documents" subtitle="Write markdown docs for your project."/> :
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-3 md:col-span-1 space-y-1 max-h-[70vh] overflow-auto">
            {items.map(d=>(
              <button key={d.id} onClick={()=>setSelected(d)} className={`w-full text-left px-3 py-2 rounded-lg ${selected?.id===d.id?'bg-brand-50 text-brand-700':'hover:bg-slate-100'}`}>
                <div className="text-xs text-slate-400">{d.section}</div><div className="font-medium text-sm">{d.title}</div>
              </button>
            ))}
          </div>
          <div className="card p-5 md:col-span-2">
            {selected ? (
              <>
                <div className="flex justify-between mb-4">
                  <div><div className="text-xs text-slate-400">{selected.section}</div><h2 className="font-bold text-xl">{selected.title}</h2></div>
                  <div className="flex gap-1">
                    <button onClick={()=>edit(selected)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={14}/></button>
                    <button onClick={()=>del(selected.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none"><ReactMarkdown>{selected.content||'*empty*'}</ReactMarkdown></div>
              </>
            ) : <div className="text-slate-500 text-sm">Select a document to preview.</div>}
          </div>
        </div>}

      <Modal open={open} onClose={()=>setOpen(false)} title={editId?'Edit doc':'New doc'}
        footer={<><button className="btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button form="df" className="btn-primary">{editId?'Save':'Create'}</button></>}>
        <form id="df" onSubmit={save} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Project</label>
              <select required className="input" value={form.project_id} onChange={e=>setForm({...form,project_id:e.target.value})}>
                <option value="">Select…</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select></div>
            <div><label className="label">Section</label>
              <select className="input" value={form.section} onChange={e=>setForm({...form,section:e.target.value})}>
                {SECTIONS.map(s=><option key={s}>{s}</option>)}
              </select></div>
          </div>
          <div><label className="label">Title *</label><input required className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><label className="label">Content (Markdown)</label><textarea rows={10} className="input font-mono text-sm" value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/></div>
        </form>
      </Modal>
    </div>
  )
}
