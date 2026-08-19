import { useLocation } from 'react-router-dom';
import { Bell, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../../store/AppContext';

const TITLES: Record<string, string> = {
  '/campaigns': 'Campaigns',
  '/creators': 'Creators',
  '/reports': 'Reports & Analytics',
};

export default function TopBar() {
  const { state } = useApp();
  const location = useLocation();
  const title = Object.entries(TITLES).find(([k]) => location.pathname.startsWith(k))?.[1] ?? 'Launchpad';

  const pendingReviews = state.deliverables.filter(d => d.status === 'in_review').length;

  return (
    <header className="h-20 border-b border-surface-800/50 bg-gradient-to-r from-surface-900/90 to-surface-950/90 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-white font-bold text-2xl tracking-tight">{title}</h1>
        <Sparkles size={20} className="text-brand-400 animate-pulse-glow" />
      </div>

      <div className="flex items-center gap-6">
        {/* Role badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-800/50 border border-surface-700/50 backdrop-blur-sm">
          <Shield size={16} className={state.currentRole === 'agency' ? 'text-brand-400' : 'text-accent-400'} />
          <span className="text-surface-200 text-sm font-bold capitalize">{state.currentRole}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-3 rounded-xl hover:bg-surface-800/50 text-surface-400 hover:text-white transition-all duration-300 cursor-pointer group">
          <Bell size={20} className="group-hover:scale-110 transition-transform duration-300" />
          {pendingReviews > 0 && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-brand-600 to-brand-700 rounded-full text-[10px] text-white flex items-center justify-center font-bold ring-2 ring-surface-900 glow-brand">
              {pendingReviews}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600/30 to-brand-800/30 border-2 border-brand-500/60 flex items-center justify-center text-brand-300 text-base font-bold avatar-glow backdrop-blur-sm">
          AG
        </div>
      </div>
    </header>
  );
}