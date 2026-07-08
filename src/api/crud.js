import { supabase } from '../lib/supabase'

// generic CRUD helpers scoped per user (owner_id)
export const crud = (table) => ({
  list: async (filters = {}) => {
    let q = supabase.from(table).select('*').order('created_at', { ascending: false })
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v)
    const { data, error } = await q
    if (error) throw error
    return data || []
  },
  get: async (id) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
    if (error) throw error
    return data
  },
  create: async (payload) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from(table).insert({ ...payload, owner_id: user.id }).select().single()
    if (error) throw error
    return data
  },
  update: async (id, payload) => {
    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  remove: async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
  },
})

export const projectsApi = crud('projects')
export const milestonesApi = crud('milestones')
export const featuresApi = crud('features')
export const bugsApi = crud('bugs')
export const releasesApi = crud('releases')
export const docsApi = crud('docs')
export const teamApi = crud('team_members')
