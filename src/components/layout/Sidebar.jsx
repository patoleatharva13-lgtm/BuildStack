import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Map, Bug, Sparkles, FileText, Rocket, Users, BarChart3, Bot, Settings } from 'lucide-react'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/bugs', label: 'Bugs', icon: Bug },
  { to: '/features', label: 'Features', icon: Sparkles },
  { to: '/documentation', label: 'Documentation', icon: FileText },
  { to: '/releases', label: 'Releases', icon: Rocket },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/ai', label: 'AI Tools', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col dark:bg-slate-900 dark:border-slate-800">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-brand-600 grid place-items-center text-white font-bold">B</div>
        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">BuildStack</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-xs text-slate-400 dark:text-slate-500 border-t dark:border-slate-800">v1.0 · BuildStack</div>
    </aside>
  )
}
