import { useEffect, useState } from 'react'
import { projectsApi, bugsApi, featuresApi, releasesApi } from '../api/crud'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { FolderKanban, Bug, Sparkles, Rocket } from 'lucide-react'

const COLORS = ['#3b62f6','#f59e0b','#10b981','#ef4444']

function Stat({ icon:Icon, label, value, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span className={`w-9 h-9 rounded-lg grid place-items-center ${color}`}><Icon size={18}/></span>
      </div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  )
}

export default function DashboardPage() {
  const [p,setP]=useState([]); const [b,setB]=useState([]); const [f,setF]=useState([]); const [r,setR]=useState([])
  useEffect(() => { (async () => {
    try {
      const [pp,bb,ff,rr] = await Promise.all([projectsApi.list(), bugsApi.list(), featuresApi.list(), releasesApi.list()])
      setP(pp); setB(bb); setF(ff); setR(rr)
    } catch (e) { console.error(e) }
  })() }, [])

  const bugPie = ['open','in progress','resolved'].map(s=>({ name:s, value:b.filter(x=>(x.status||'').toLowerCase()===s).length }))
  const activity = Array.from({length:7}).map((_,i)=>({ day:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], count: Math.max(0, [...b,...f,...r].filter(x=>{
    const d = new Date(x.created_at); return (Date.now()-d.getTime())/86400000 < 7 && d.getDay()===((i+1)%7)
  }).length) }))
  const featureBar = ['pending','in progress','completed'].map(s=>({ status:s, count:f.filter(x=>(x.status||'').toLowerCase()===s).length }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={FolderKanban} label="Projects"  value={p.length} color="bg-brand-100 text-brand-700"/>
        <Stat icon={Bug}          label="Open Bugs" value={b.filter(x=>x.status==='open').length} color="bg-red-100 text-red-700"/>
        <Stat icon={Sparkles}     label="Features"  value={f.length} color="bg-purple-100 text-purple-700"/>
        <Stat icon={Rocket}       label="Releases"  value={r.length} color="bg-green-100 text-green-700"/>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Features by status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={featureBar}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="status"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="count" fill="#3b62f6" radius={[6,6,0,0]}/></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Bug distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={bugPie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>{bugPie.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-5">
        <h3 className="font-semibold mb-4">Weekly activity</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={activity}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis allowDecimals={false}/><Tooltip/><Line type="monotone" dataKey="count" stroke="#3b62f6" strokeWidth={2}/></LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
