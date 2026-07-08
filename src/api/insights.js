import { supabase } from '../lib/supabase'
import { notifications as demoNotifications, searchIndex as demoSearchIndex } from '../lib/mockData'

const normalize = (value) => (value || '').toString().toLowerCase()

const matches = (term, ...values) => values.some((value) => normalize(value).includes(term))

const getUserId = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user?.id
}

export async function getSearchResults(query) {
  const term = normalize(query).trim()
  if (!term) return []

  const fallback = demoSearchIndex.filter((item) => matches(term, item.title, item.description, item.type))

  try {
    const ownerId = await getUserId()
    if (!ownerId) return fallback

    const [{ data: projects = [] }, { data: features = [] }, { data: bugs = [] }, { data: docs = [] }, { data: releases = [] }, { data: teamMembers = [] }] = await Promise.all([
      supabase.from('projects').select('id,name,description').eq('owner_id', ownerId),
      supabase.from('features').select('id,title,description').eq('owner_id', ownerId),
      supabase.from('bugs').select('id,title,description').eq('owner_id', ownerId),
      supabase.from('docs').select('id,title,content').eq('owner_id', ownerId),
      supabase.from('releases').select('id,version,notes').eq('owner_id', ownerId),
      supabase.from('team_members').select('id,name,email,role').eq('owner_id', ownerId),
    ])

    const results = [
      ...projects.filter((item) => matches(term, item.name, item.description)).map((item) => ({ id: item.id, type: 'Project', title: item.name, description: item.description || 'Project', path: `/projects/${item.id}` })),
      ...features.filter((item) => matches(term, item.title, item.description)).map((item) => ({ id: item.id, type: 'Feature', title: item.title, description: item.description || 'Feature request', path: '/features' })),
      ...bugs.filter((item) => matches(term, item.title, item.description)).map((item) => ({ id: item.id, type: 'Bug', title: item.title, description: item.description || 'Bug report', path: '/bugs' })),
      ...docs.filter((item) => matches(term, item.title, item.content)).map((item) => ({ id: item.id, type: 'Document', title: item.title, description: item.content || 'Documentation', path: '/documentation' })),
      ...releases.filter((item) => matches(term, item.version, item.notes)).map((item) => ({ id: item.id, type: 'Release', title: item.version, description: item.notes || 'Release notes', path: '/releases' })),
      ...teamMembers.filter((item) => matches(term, item.name, item.email, item.role)).map((item) => ({ id: item.id, type: 'Team member', title: item.name || item.email, description: item.role || 'Team member', path: '/team' })),
    ]

    return results.slice(0, 8)
  } catch (error) {
    console.warn('[BuildStack] Search fallback used:', error)
    return fallback
  }
}

export async function getNotifications() {
  const fallback = demoNotifications

  try {
    const ownerId = await getUserId()
    if (!ownerId) return fallback

    const [{ data: features = [] }, { data: bugs = [] }, { data: releases = [] }, { data: teamMembers = [] }] = await Promise.all([
      supabase.from('features').select('id,title,deadline').eq('owner_id', ownerId),
      supabase.from('bugs').select('id,title,status').eq('owner_id', ownerId),
      supabase.from('releases').select('id,version,released_on').eq('owner_id', ownerId),
      supabase.from('team_members').select('id,name,status').eq('owner_id', ownerId),
    ])

    const items = []

    features
      .filter((item) => item.deadline)
      .forEach((item) => {
        const deadline = new Date(item.deadline)
        const now = new Date()
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
        if (diffDays >= 0 && diffDays <= 2) {
          items.push({ id: `feature-${item.id}`, title: 'Task due soon', message: `${item.title} is due ${diffDays === 0 ? 'today' : `in ${diffDays} day${diffDays === 1 ? '' : 's'}`}.`, time: 'Now', unread: true })
        }
      })

    if (bugs.some((item) => item.status === 'open')) {
      items.push({ id: 'bug-open', title: 'New bug tracked', message: 'You have open bugs that need a follow-up.', time: 'Today', unread: true })
    }

    if (releases.some((item) => {
      const released = new Date(item.released_on)
      const now = new Date()
      return released >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3)
    })) {
      items.push({ id: 'release-latest', title: 'Release published', message: 'A recent release is available for review.', time: 'Today', unread: false })
    }

    if (teamMembers.some((item) => item.status === 'invited')) {
      items.push({ id: 'team-invite', title: 'Teammate invited', message: 'A teammate is waiting on your workspace invitation.', time: 'Today', unread: false })
    }

    return items.length ? items : fallback
  } catch (error) {
    console.warn('[BuildStack] Notifications fallback used:', error)
    return fallback
  }
}
