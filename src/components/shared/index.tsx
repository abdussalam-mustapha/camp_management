import React from 'react';
import type { Platform, CampaignStatus, DeliverableStatus } from '../../data/types';

// ── Status Pills ──────────────────────────────────────────────
const CAMPAIGN_STATUS_STYLES: Record<CampaignStatus, { bg: string; text: string; border: string; glow: string }> = {
  draft:      { bg: 'bg-surface-800/80', text: 'text-surface-300', border: 'border-surface-600/50', glow: '' },
  executing:  { bg: 'bg-sunset-500/20', text: 'text-sunset-300', border: 'border-sunset-500/40', glow: 'glow-sunset' },
  in_review:  { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/40', glow: '' },
  approved:   { bg: 'bg-brand-500/20', text: 'text-brand-300', border: 'border-brand-500/40', glow: 'glow-brand' },
  live:       { bg: 'bg-accent-500/20', text: 'text-accent-300', border: 'border-accent-500/40', glow: 'glow-accent' },
  completed:  { bg: 'bg-surface-700/60', text: 'text-surface-400', border: 'border-surface-600/50', glow: '' },
};

const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: 'Draft', executing: 'Executing', in_review: 'In Review',
  approved: 'Approved', live: 'Live', completed: 'Completed',
};

export function CampaignStatusPill({ status }: { status: CampaignStatus }) {
  const style = CAMPAIGN_STATUS_STYLES[status];
  return (
    <span className={`status-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${style.bg} ${style.text} ${style.border} ${style.glow} transition-all duration-300`}>
      <span className={`w-2 h-2 rounded-full ${style.text} animate-pulse-glow`} />
      {CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}

const DELIVERABLE_STATUS_STYLES: Record<DeliverableStatus, { bg: string; text: string; border: string; glow: string }> = {
  executing:          { bg: 'bg-sunset-500/20', text: 'text-sunset-300', border: 'border-sunset-500/40', glow: 'glow-sunset' },
  in_review:          { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/40', glow: '' },
  approved:           { bg: 'bg-brand-500/20', text: 'text-brand-300', border: 'border-brand-500/40', glow: 'glow-brand' },
  live:               { bg: 'bg-accent-500/20', text: 'text-accent-300', border: 'border-accent-500/40', glow: 'glow-accent' },
  completed:          { bg: 'bg-surface-700/60', text: 'text-surface-400', border: 'border-surface-600/50', glow: '' },
  revision_requested: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40', glow: '' },
};

const DELIVERABLE_STATUS_LABELS: Record<DeliverableStatus, string> = {
  executing: 'Executing', in_review: 'In Review', approved: 'Approved',
  live: 'Live', completed: 'Completed', revision_requested: 'Revision Req.',
};

export function DeliverableStatusPill({ status }: { status: DeliverableStatus }) {
  const style = DELIVERABLE_STATUS_STYLES[status];
  return (
    <span className={`status-pill inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} ${style.border} ${style.glow} transition-all duration-300`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.text} animate-pulse-glow`} />
      {DELIVERABLE_STATUS_LABELS[status]}
    </span>
  );
}

// ── Platform Badge ────────────────────────────────────────────
const PLATFORM_STYLES: Record<Platform, { bg: string; text: string; border: string; label: string; glow: string }> = {
  instagram: { bg: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20', text: 'text-pink-300', border: 'border-pink-500/40', label: 'Instagram', glow: 'shadow-pink-500/20' },
  tiktok:    { bg: 'bg-gradient-to-r from-surface-700/60 to-surface-600/60', text: 'text-surface-200', border: 'border-surface-500/40', label: 'TikTok', glow: '' },
  youtube:   { bg: 'bg-gradient-to-r from-red-500/20 to-orange-500/20', text: 'text-red-300', border: 'border-red-500/40', label: 'YouTube', glow: 'shadow-red-500/20' },
  facebook:  { bg: 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20', text: 'text-blue-300', border: 'border-blue-500/40', label: 'Facebook', glow: 'shadow-blue-500/20' },
  x:         { bg: 'bg-gradient-to-r from-surface-600/40 to-surface-700/40', text: 'text-surface-300', border: 'border-surface-500/40', label: 'X (Twitter)', glow: '' },
};

export function PlatformBadge({ platform, size = 'sm' }: { platform: Platform; size?: 'sm' | 'xs' | 'lg' }) {
  const { bg, text, border, label, glow } = PLATFORM_STYLES[platform];
  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-xs font-medium',
    lg: 'px-4 py-1.5 text-sm font-semibold'
  };
  return (
    <span className={`inline-flex items-center rounded-full ${bg} ${text} ${border} ${sizes[size]} ${glow} shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
      {label}
    </span>
  );
}

// ── Generic Badge ─────────────────────────────────────────────
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
const BADGE_VARIANTS: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: { bg: 'bg-surface-800/80', text: 'text-surface-300', border: 'border-surface-600/50' },
  success: { bg: 'bg-accent-500/20', text: 'text-accent-300', border: 'border-accent-500/40' },
  warning: { bg: 'bg-sunset-500/20', text: 'text-sunset-300', border: 'border-sunset-500/40' },
  danger:  { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/40' },
  info:    { bg: 'bg-brand-500/20', text: 'text-brand-300', border: 'border-brand-500/40' },
  brand:   { bg: 'bg-brand-600/30', text: 'text-brand-200', border: 'border-brand-500/50' },
};

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const style = BADGE_VARIANTS[variant];
  return (
    <span className={`badge-premium inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${style.bg} ${style.text} ${style.border} backdrop-blur-sm transition-all duration-300`}>
      {children}
    </span>
  );
}

// ── Button ────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const BTN_VARIANTS: Record<ButtonVariant, string> = {
  primary:   'btn-premium text-white font-bold btn-shine-effect shadow-xl shadow-brand-500/20',
  secondary: 'bg-surface-800/80 hover:bg-surface-700/80 text-surface-200 border-2 border-surface-600/50 hover:border-surface-500/50 font-bold shadow-lg',
  ghost:     'hover:bg-surface-800/60 text-surface-400 hover:text-white font-bold',
  danger:    'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-2 border-rose-500/40 hover:border-rose-500/50 font-bold shadow-lg shadow-rose-500/20',
};

const BTN_SIZES: Record<ButtonSize, string> = {
  sm: 'px-6 py-3 text-sm',
  md: 'px-8 py-3.5 text-base',
  lg: 'px-10 py-4 text-lg',
  icon: 'p-3',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ripple hover:scale-105 active:scale-95 ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({ src, name, size = 'md' }: { src?: string; name: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = { 
    xs: 'w-6 h-6 text-[10px]', 
    sm: 'w-8 h-8 text-xs', 
    md: 'w-10 h-10 text-sm', 
    lg: 'w-12 h-12 text-base', 
    xl: 'w-16 h-16 text-lg' 
  };
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-surface-700/50 ring-offset-2 ring-offset-surface-900 avatar-glow`} />;
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-600/30 to-brand-800/30 border-2 border-brand-500/40 flex items-center justify-center text-brand-300 font-semibold avatar-glow backdrop-blur-sm`}>
      {initials}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────
export function ProgressBar({ pct, color = 'brand' }: { pct: number; color?: 'brand' | 'accent' | 'sunset' | 'rose' }) {
  const colors = {
    brand: 'bg-gradient-to-r from-brand-600 to-brand-500',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-500',
    sunset: 'bg-gradient-to-r from-sunset-600 to-sunset-500',
    rose: 'bg-gradient-to-r from-rose-600 to-rose-500',
  };
  return (
    <div className="w-full bg-surface-800/80 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-surface-700/50">
      <div
        className={`h-2 rounded-full progress-bar-animated transition-all duration-700 ${colors[color]}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="glass-card p-6 flex flex-col gap-3 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-2xl group-hover:from-brand-500/20 transition-all duration-500" />
      <div className="flex items-center justify-between relative z-10">
        <p className="text-surface-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        {icon && <span className="text-brand-400 group-hover:text-brand-300 transition-colors">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-white relative z-10 group-hover:scale-105 transition-transform duration-300">{value}</p>
      {sub && <p className="text-surface-500 text-sm relative z-10">{sub}</p>}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-surface-800/80 to-surface-900/80 flex items-center justify-center text-surface-500 text-5xl border border-surface-700/50 shadow-2xl animate-float">
        {icon}
      </div>
      <div className="space-y-2">
        <p className="text-surface-300 font-bold text-2xl">{title}</p>
        {description && <p className="text-surface-500 text-lg">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative w-full ${widths[size]} glass-card shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col border border-brand-500/20`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-surface-700/50 bg-gradient-to-r from-surface-800/50 to-surface-900/50">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-surface-400 hover:text-white transition-colors cursor-pointer text-2xl leading-none p-1 rounded-lg hover:bg-surface-800/50">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────
export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const { label, className = '', ...rest } = props;
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-surface-300 text-sm font-semibold">{label}</label>}
      <input
        className={`input-premium w-full rounded-xl px-4 py-3 text-surface-200 text-base placeholder-surface-500 ${className}`}
        {...rest}
      />
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }) {
  const { label, options, className = '', ...rest } = props;
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-surface-300 text-sm font-semibold">{label}</label>}
      <select
        className={`input-premium w-full rounded-xl px-4 py-3 text-surface-200 text-sm cursor-pointer ${className}`}
        {...rest}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  const { label, className = '', ...rest } = props;
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-surface-300 text-sm font-semibold">{label}</label>}
      <textarea
        className={`input-premium w-full rounded-xl px-4 py-3 text-surface-200 text-base placeholder-surface-500 resize-none ${className}`}
        {...rest}
      />
    </div>
  );
}

// ── Format helpers ────────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

// ── Custom scrollbar for overflow containers ─────────────────
export function customScrollbar() {
  return 'custom-scrollbar';
}