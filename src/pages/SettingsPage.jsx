import { useEffect, useState } from 'react'
import { Moon, Sun, ShieldCheck, BellRing, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const defaultPreferences = {
  theme: 'dark',
  emailDigest: true,
  mentionAlerts: true,
  releaseAlerts: false,
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [password, setPassword] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('buildstack-settings')
    if (stored) {
      setPreferences(JSON.parse(stored))
    } else {
      setPreferences((current) => ({ ...current, theme }))
    }
  }, [theme])

  useEffect(() => {
    setPreferences((current) => ({ ...current, theme }))
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark')
    localStorage.setItem('buildstack-settings', JSON.stringify(preferences))
  }, [preferences])

  const updatePreference = (key, value) => {
    if (key === 'theme') setTheme(value)
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-slate-500">Personalize your workspace controls and communication preferences.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-600 text-white grid place-items-center text-lg font-semibold">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">Profile</h3>
                <p className="text-sm text-slate-500">Manage the experience for your workspace account.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-700">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-500">Signed up</span>
                <span className="font-medium text-slate-700">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span className="text-slate-500">Workspace role</span>
                <span className="font-medium text-slate-700">Product lead</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Sun size={18} className="text-slate-600" />
              <h3 className="font-semibold">Theme</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button onClick={() => updatePreference('theme', 'light')} className={`rounded-xl border px-4 py-3 text-left ${preferences.theme === 'light' ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}>
                <div className="font-medium text-slate-800">Light</div>
                <div className="text-sm text-slate-500">Classic daytime view</div>
              </button>
              <button onClick={() => updatePreference('theme', 'dark')} className={`rounded-xl border px-4 py-3 text-left ${preferences.theme === 'dark' ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}>
                <div className="font-medium text-slate-800">Dark</div>
                <div className="text-sm text-slate-500">Comfortable for late-night work</div>
              </button>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2">
              <BellRing size={18} className="text-slate-600" />
              <h3 className="font-semibold">Email preferences</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span>Daily digest</span>
                <input type="checkbox" checked={preferences.emailDigest} onChange={(event) => updatePreference('emailDigest', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span>Mentions and replies</span>
                <input type="checkbox" checked={preferences.mentionAlerts} onChange={(event) => updatePreference('mentionAlerts', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                <span>Release updates</span>
                <input type="checkbox" checked={preferences.releaseAlerts} onChange={(event) => updatePreference('releaseAlerts', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-slate-600" />
              <h3 className="font-semibold">Password</h3>
            </div>
            <div className="mt-4 space-y-3">
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="input" />
              <button className="btn btn-secondary">Update password</button>
            </div>
          </div>

          <div className="card p-6 border-rose-200">
            <div className="flex items-center gap-2">
              <Trash2 size={18} className="text-rose-600" />
              <h3 className="font-semibold text-rose-700">Account deletion</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">Permanently remove your account and all associated workspace data.</p>
            <button className="mt-4 btn bg-rose-600 text-white hover:bg-rose-700">Delete account</button>
          </div>

        </div>
      </div>
    </div>
  )
}
