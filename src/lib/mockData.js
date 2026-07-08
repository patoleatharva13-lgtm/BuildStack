export const searchIndex = [
  {
    id: 1,
    type: 'Project',
    title: 'Website redesign',
    description: 'Marketing launch experience',
    path: '/projects/1',
  },
  {
    id: 2,
    type: 'Feature',
    title: 'AI release notes',
    description: 'Generate summaries from sprint data',
    path: '/features',
  },
  {
    id: 3,
    type: 'Bug',
    title: 'Invite link expiry',
    description: 'Members cannot join after 24h',
    path: '/bugs',
  },
  {
    id: 4,
    type: 'Team member',
    title: 'Mina Chen',
    description: 'Product designer',
    path: '/team',
  },
  {
    id: 5,
    type: 'Document',
    title: 'Release checklist',
    description: 'Final QA and rollout notes',
    path: '/documentation',
  },
  {
    id: 6,
    type: 'Release',
    title: 'v1.3.0',
    description: 'Published to staging yesterday',
    path: '/releases',
  },
]

export const notifications = [
  {
    id: 1,
    title: 'Task due tomorrow',
    message: 'Finalize the onboarding flow before 10:00 AM.',
    time: '10m ago',
    unread: true,
  },
  {
    id: 2,
    title: 'New bug assigned',
    message: 'Alex assigned you to investigate the invite issue.',
    time: '1h ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Release published',
    message: 'BuildStack v1.3.0 is now live in staging.',
    time: '3h ago',
    unread: false,
  },
  {
    id: 4,
    title: 'Teammate accepted invite',
    message: 'Mina joined your workspace and can start collaborating.',
    time: 'Today',
    unread: false,
  },
]
