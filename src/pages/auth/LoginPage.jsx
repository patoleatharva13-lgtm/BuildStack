import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell from './_shell'

export default function LoginPage() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setErr(error.message); else nav('/dashboard')
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your BuildStack workspace."
      footer={<>Don't have an account? <Link className="text-brand-600 font-medium" to="/signup">Sign up</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Email</label><input required className="input" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div><label className="label">Password</label><input required type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)}/></div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button disabled={loading} className="btn-primary w-full justify-center">{loading?'Logging in…':'Login'}</button>
        <Link to="/forgot-password" className="text-sm text-slate-500 hover:text-brand-600 block text-center">Forgot password?</Link>
      </form>
    </AuthShell>
  )
}
