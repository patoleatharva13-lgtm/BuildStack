import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell from './_shell'
export default function ResetPasswordPage() {
  const { updatePassword } = useAuth(); const nav = useNavigate()
  const [password,setPassword]=useState(''); const [msg,setMsg]=useState(''); const [err,setErr]=useState('')
  const submit = async e => {
    e.preventDefault(); setErr(''); setMsg('')
    const { error } = await updatePassword(password)
    if (error) setErr(error.message)
    else { setMsg('Password updated. Redirecting…'); setTimeout(()=>nav('/login'), 1200) }
  }
  return (
    <AuthShell title="Set a new password">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">New password</label><input required type="password" minLength={6} className="input" value={password} onChange={e=>setPassword(e.target.value)}/></div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        {msg && <div className="text-sm text-green-700">{msg}</div>}
        <button className="btn-primary w-full justify-center">Update password</button>
      </form>
    </AuthShell>
  )
}
