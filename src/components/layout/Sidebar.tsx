import { NavLink } from 'react-router-dom';
import {
  Users, BarChart3, Megaphone,
  Settings, LogOut, Zap, RefreshCw
} from 'lucide-react';
import { useApp } from '../../store/AppContext';

const NAV = [
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/creators', label: 'Creators', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

const BOTTOM_NAV = [
  { label: 'Viewing As', type: 'switcher' },
  { label: 'Reset Data', icon: RefreshCw, action: 'reset' },
];

export default function Sidebar() {
  const { state, dispatch, resetToSeed } = useApp();

  return (
    <aside className="w-64 min-h-screen bg-surface-900 border-r border-surface-800/50 flex flex-col ">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-surface-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg tracking-tight">Launchpad</p>
            <p className="text-surface-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Campaign OS</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 py-6 flex flex-col  h-[600px]">
        <div className="space-y-1 h-[500px]">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 mt-[40px] px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-300'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-surface-800/50">
        {/* Role Switcher */}
        <div className="mb-3">
          <p className="text-surface-500 text-[10px] font-bold uppercase tracking-wider mb-2 px-1">Viewing As</p>
          <div className="flex rounded-lg overflow-hidden border border-surface-700/50 bg-surface-800/40">
            {(['agency', 'brand'] as const).map(role => (
              <button
                key={role}
                onClick={() => dispatch({ type: 'ROLE_SWITCH', payload: role })}
                className={`flex-1 py-2 text-xs font-semibold capitalize transition-all cursor-pointer ${
                  state.currentRole === role
                    ? 'bg-brand-500 text-white'
                    : 'text-surface-400 hover:text-white hover:bg-surface-700/50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetToSeed}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-surface-400 hover:text-white hover:bg-surface-800/50 rounded-lg transition-all duration-150 cursor-pointer font-medium"
        >
          <RefreshCw size={16} className="shrink-0" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
}