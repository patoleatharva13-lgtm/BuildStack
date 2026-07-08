import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell from './_shell'
export default function ForgotPasswordPage() {
  const { forgot } = useAuth()
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState('')
  const submit = async e => {
    e.preventDefault(); setErr(''); setMsg('')
    const { error } = await forgot(email)
    if (error) setErr(error.message); else setMsg('Password reset email sent. Check your inbox.')
  }
  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a reset link."
      footer={<Link to="/login" className="text-brand-600">Back to login</Link>}>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Email</label><input required type="email" className="input" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        {msg && <div className="text-sm text-green-700">{msg}</div>}
        <button className="btn-primary w-full justify-center">Send reset link</button>
      </form>
    </AuthShell>
  )
}
