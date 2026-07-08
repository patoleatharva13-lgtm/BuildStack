export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="card p-10 text-center">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
