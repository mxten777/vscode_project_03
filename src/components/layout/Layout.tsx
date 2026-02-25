import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, ArrowLeftRight, Home, LogOut, Library, BarChart3, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/', icon: Home, label: '홈' },
  { to: '/books', icon: Library, label: '서재' },
  { to: '/friends', icon: Users, label: '친구' },
  { to: '/loans', icon: ArrowLeftRight, label: '대여' },
  { to: '/stats', icon: BarChart3, label: '통계' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen">
      {/* ─── Top Header ─── */}
      <header className="glass-strong sticky top-0 z-40 border-b border-white/40">
        <div className="mx-auto flex h-14 sm:h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25 transition-all duration-300 group-hover:shadow-primary-500/40 group-hover:scale-105">
              <BookOpen className="h-5 w-5 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
              BookBuddy
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-primary-50/80 pl-3 pr-1.5 py-1.5 border border-primary-100/50">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-[11px] font-bold text-white shadow-sm ring-2 ring-white/50">
                {(user?.displayName ?? user?.email ?? '?')[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-primary-800 max-w-[120px] truncate">
                {user?.displayName || user?.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                className="rounded-full p-1.5 text-primary-400 hover:bg-primary-100 hover:text-primary-700 transition-all duration-200 active:scale-90"
                title="로그아웃"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={signOut}
              className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-90"
              title="로그아웃"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ─── Desktop Sidebar ─── */}
        <nav className="fixed left-0 top-14 sm:top-16 bottom-0 hidden w-56 border-r border-white/40 glass sm:flex flex-col justify-between py-4 z-30">
          <div className="flex flex-col gap-1 px-3">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 overflow-hidden
                    ${active
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-500 hover:bg-white/80 hover:text-primary-700 hover:shadow-sm'}`}
                >
                  {active && (
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer bg-[length:200%_100%]" />
                  )}
                  <Icon className={`relative h-[18px] w-[18px] transition-all duration-300 group-hover:scale-110 ${active ? 'text-white' : ''}`} />
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sidebar user card */}
          <div className="mx-3 rounded-2xl bg-gradient-to-br from-primary-50 via-primary-100/30 to-primary-50 border border-primary-100/50 p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-bold text-white shadow-md ring-2 ring-white/50">
                {(user?.displayName ?? user?.email ?? '?')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary-900 truncate">
                  {user?.displayName || '사용자'}
                </p>
                <p className="text-[11px] text-primary-500/80 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* ─── Main Content ─── */}
        <main className="flex-1 sm:ml-56">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 pb-24 sm:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/40 glass-strong sm:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-semibold transition-all duration-300
                  ${active
                    ? 'text-primary-600'
                    : 'text-gray-400 active:text-primary-500 active:scale-90'}`}
              >
                {active && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 shadow-sm shadow-primary-500/30" />
                )}
                <Icon className={`h-5 w-5 transition-all duration-300 ${active ? 'scale-110 drop-shadow-sm' : ''}`} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
