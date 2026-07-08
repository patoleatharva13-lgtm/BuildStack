const styles = {
  active:'bg-green-100 text-green-700', completed:'bg-green-100 text-green-700', resolved:'bg-green-100 text-green-700',
  'in progress':'bg-blue-100 text-blue-700', 'in-progress':'bg-blue-100 text-blue-700',
  planned:'bg-slate-100 text-slate-700', pending:'bg-slate-100 text-slate-700',
  open:'bg-yellow-100 text-yellow-700', invited:'bg-yellow-100 text-yellow-700',
  critical:'bg-red-100 text-red-700', high:'bg-orange-100 text-orange-700',
  medium:'bg-blue-100 text-blue-700', low:'bg-slate-100 text-slate-700',
}
export default function Badge({ value }) {
  const cls = styles[(value||'').toLowerCase()] || 'bg-slate-100 text-slate-700'
  return <span className={`badge ${cls}`}>{value}</span>
}
