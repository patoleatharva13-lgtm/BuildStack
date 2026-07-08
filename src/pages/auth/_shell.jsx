import { Link } from 'react-router-dom'
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-brand-600 text-white p-10">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-9 h-9 rounded-xl bg-white/20 grid place-items-center">B</div> BuildStack
        </Link>
        <div>
          <h2 className="text-3xl font-bold">Plan. Build. Track. Release.</h2>
          <p className="mt-3 text-brand-100">One workspace for developers to ship faster.</p>
        </div>
        <div className="text-sm text-brand-100">© {new Date().getFullYear()} BuildStack</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
          <div className="mt-8 space-y-4">{children}</div>
          {footer && <div className="mt-6 text-sm text-slate-600">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
