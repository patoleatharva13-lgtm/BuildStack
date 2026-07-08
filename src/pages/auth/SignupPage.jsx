import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell from './_shell'

export default function SignupPage() {
  const { signUp } = useAuth(); const nav = useNavigate()
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const [msg,setMsg]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false)

  const submit = async e => {
    e.preventDefault(); setErr(''); setMsg(''); setLoading(true)
    const { data, error } = await signUp(email, password, name)
    setLoading(false)
    if (error) return setErr(error.message)
    if (data.session) nav('/dashboard')
    else setMsg('Check your email to verify your account, then log in.')
  }

  return (
    <AuthShell title="Create your account" subtitle="Start building smarter in seconds."
      footer={<>Already have an account? <Link className="text-brand-600 font-medium" to="/login">Login</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Full name</label><input required className="input" value={name} onChange={e=>setName(e.target.value)}/></div>
        <div><label className="label">Email</label><input required type="email" className="input" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div><label className="label">Password</label><input required type="password" minLength={6} className="input" value={password} onChange={e=>setPassword(e.target.value)}/></div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        {msg && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{msg}</div>}
        <button disabled={loading} className="btn-primary w-full justify-center">{loading?'Creating…':'Create account'}</button>
      </form>
    </AuthShell>
  )
}
