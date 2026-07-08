import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null); setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signUp = (email, password, full_name) =>
    supabase.auth.signUp({ email, password, options: { data: { full_name }, emailRedirectTo: window.location.origin + '/login' } })
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signOut = () => supabase.auth.signOut()
  const forgot = (email) => supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })
  const updatePassword = (password) => supabase.auth.updateUser({ password })

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, forgot, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}
