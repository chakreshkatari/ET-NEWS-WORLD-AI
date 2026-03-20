import { Outlet, NavLink } from 'react-router-dom';
import { Newspaper, Compass, Video, Activity, Languages } from 'lucide-react';

export default function Layout() {
  const navItems = [
    { to: '/', icon: Newspaper, label: 'My ET' },
    { to: '/navigator', icon: Compass, label: 'News Navigator' },
    { to: '/studio', icon: Video, label: 'Video Studio' },
    { to: '/story-arc', icon: Activity, label: 'Story Arc' },
    { to: '/vernacular', icon: Languages, label: 'Vernacular' },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ET Future
          </h1>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-mono">Newsroom 2026</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 font-mono text-center">
          Powered by Gemini 3.1 Pro
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 -z-10" />
        <div className="p-8 max-w-6xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
