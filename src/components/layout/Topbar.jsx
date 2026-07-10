import { useEffect, useMemo, useState } from 'react'
import { Search, Bell, LogOut, Sparkles, Moon, Sun } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { getNotifications, getSearchResults } from '../../api/insights'

export default function Topbar() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const nav = useNavigate()
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const data = await getNotifications()
        if (isMounted) setNotifications(data)
      } catch (error) {
        console.error(error)
      }
    }

    load()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let isMounted = true
    const runSearch = async () => {
      if (!query.trim()) {
        setFilteredResults([])
        return
      }
      setLoading(true)
      try {
        const data = await getSearchResults(query)
        if (isMounted) setFilteredResults(data)
      } catch (error) {
        console.error(error)
        if (isMounted) setFilteredResults([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    const timeout = window.setTimeout(runSearch, 250)
    return () => {
      window.clearTimeout(timeout)
      isMounted = false
    }
  }, [query])

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications])

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between relative">
      <div className="flex items-center gap-2 flex-1 max-w-md relative">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onFocus={() => setShowSearch(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setShowSearch(true)
          }}
          placeholder="Search projects, bugs, features…"
          className="input border-transparent focus:border-slate-300"
        />
        {showSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
            {query.trim() ? (
              loading ? (
                <div className="px-3 py-4 text-sm text-slate-500">Searching…</div>
              ) : filteredResults.length ? (
                <ul className="max-h-72 overflow-auto py-2">
                  {filteredResults.map((item) => (
                    <li key={item.id}>
                      <Link to={item.path} onClick={() => { setShowSearch(false); setQuery('') }} className="flex items-start gap-3 px-3 py-2 hover:bg-slate-50">
                        <div className="mt-0.5 rounded-full bg-brand-50 p-1.5 text-brand-600"><Sparkles size={14} /></div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.type} · {item.description}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-4 text-sm text-slate-500">No matches found for “{query}”.</div>
              )
            ) : (
              <div className="px-3 py-4 text-sm text-slate-500">Try searching for projects, bugs, features, docs, releases, or teammates.</div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="btn-ghost" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative">
          <button onClick={() => setShowNotifications((value) => !value)} className="relative text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100">
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-20 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-800">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Notifications</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
                </div>
                <button onClick={() => setNotifications((current) => current.map((item) => ({ ...item, unread: false })))} className="text-sm text-brand-600 hover:text-brand-700">Mark all read</button>
              </div>
              <ul className="max-h-80 overflow-auto">
                {notifications.map((item) => (
                  <li key={item.id} className={`px-4 py-3 border-b last:border-b-0 ${item.unread ? 'bg-slate-50 dark:bg-slate-950' : 'bg-white dark:bg-slate-900'} dark:border-slate-800`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.message}</p>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{item.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white grid place-items-center text-sm font-medium">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-slate-700 hidden md:block dark:text-slate-200">{user?.email}</span>
        </div>
        <button onClick={async () => { await signOut(); nav('/login') }} className="btn-ghost"><LogOut size={16} /> Logout</button>
      </div>
    </header>
  )
}
