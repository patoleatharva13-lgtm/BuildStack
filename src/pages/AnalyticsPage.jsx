import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, CartesianGrid, Legend } from 'recharts'
import { projectsApi, bugsApi, featuresApi, releasesApi } from '../api/crud'

const COLORS=['#3b62f6','#f59e0b','#10b981','#ef4444','#8b5cf6']
export default function AnalyticsPage() {
  const [p,setP]=useState([]); const [b,setB]=useState([]); const [f,setF]=useState([]); const [r,setR]=useState([])
  useEffect(()=>{ (async ()=>{
    const [pp,bb,ff,rr]=await Promise.all([projectsApi.list(), bugsApi.list(), featuresApi.list(), releasesApi.list()])
    setP(pp);setB(bb);setF(ff);setR(rr)
  })() },[])

  const bugPie = ['open','in progress','resolved'].map(s=>({ name:s, value:b.filter(x=>(x.status||'').toLowerCase()===s).length }))
  const weeks = Array.from({length:8}).map((_,i)=>{
    const label = `W${i+1}`
    const start = Date.now() - (7-i)*7*86400000
    const end = start + 7*86400000
    const inR = (arr)=>arr.filter(x=>{ const t=new Date(x.created_at).getTime(); return t>=start && t<end }).length
    return { week:label, features: inR(f), bugs: inR(b) }
  })
  const releaseArea = Array.from({length:6}).map((_,i)=>{
    const month = new Date(); month.setMonth(month.getMonth()-(5-i))
    const label = month.toLocaleString('en',{month:'short'})
    const count = r.filter(x=>new Date(x.created_at).getMonth()===month.getMonth() && new Date(x.created_at).getFullYear()===month.getFullYear()).length
    return { month:label, releases:count }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Features vs Bugs per week</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeks}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="week"/><YAxis allowDecimals={false}/><Tooltip/><Legend/><Bar dataKey="features" fill="#3b62f6" radius={[4,4,0,0]}/><Bar dataKey="bugs" fill="#ef4444" radius={[4,4,0,0]}/></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Bug status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart><Pie data={bugPie} dataKey="value" nameKey="name" outerRadius={100} label>{bugPie.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/><Legend/></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Releases over time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={releaseArea}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis allowDecimals={false}/><Tooltip/><Area type="monotone" dataKey="releases" stroke="#10b981" fill="#10b98155"/></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Project completion</h3>
          <div className="space-y-3">
            {p.map(pr=>{
              const total=f.filter(x=>x.project_id===pr.id).length||1
              const done=f.filter(x=>x.project_id===pr.id && (x.status||'').toLowerCase()==='completed').length
              const pct=Math.round(done/total*100)
              return (
                <div key={pr.id}>
                  <div className="flex justify-between text-sm mb-1"><span>{pr.name}</span><span>{pct}%</span></div>
                  <div className="h-2 bg-slate-100 rounded-full"><div className="h-2 bg-brand-600 rounded-full" style={{width:`${pct}%`}}/></div>
                </div>
              )
            })}
            {p.length===0 && <div className="text-sm text-slate-500">No projects yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
