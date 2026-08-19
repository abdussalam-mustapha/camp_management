import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Users, Package, Sparkles } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { getCampaignKPIs } from '../../store/selectors';
import {
  CampaignStatusPill, Button, EmptyState, ProgressBar, formatNumber
} from '../shared';
import CreateCampaignModal from './CreateCampaignModal';
import type { Campaign } from '../../data/types';

export default function CampaignsPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = state.campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            All Campaigns
            <Sparkles size={24} className="text-brand-400 animate-pulse-glow" />
          </h2>
          <p className="text-surface-400 text-base mt-2">{state.campaigns.length} campaigns total</p>
        </div>
        {state.currentRole === 'agency' && (
          <Button onClick={() => setShowCreate(true)} size="lg" className="btn-premium">
            <Plus size={18} /> New Campaign
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search campaigns or brands..."
          className="input-premium w-full rounded-2xl pl-12 pr-6 py-4 text-surface-200 text-base placeholder-surface-500"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package size={32} />}
          title="No campaigns found"
          description="Create your first campaign to get started"
          action={
            state.currentRole === 'agency'
              ? <Button onClick={() => setShowCreate(true)}><Plus size={16} /> New Campaign</Button>
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filtered.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      )}

      <CreateCampaignModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { state } = useApp();
  const kpis = getCampaignKPIs(state, campaign.id);
  const creators = state.creators.filter(c => campaign.creatorIds.includes(c.id));

  const daysLeft = Math.ceil(
    (new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link to={`/campaigns/${campaign.id}`} className="block group">
      <div className="glass-card p-10 hover:border-brand-500/50 transition-all duration-500 h-full flex flex-col gap-8 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-brand-500/10">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div
              className="w-16 h-16 rounded-2xl mb-5 flex items-center justify-center text-white text-3xl font-bold shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${campaign.coverColor}dd, ${campaign.coverColor}77)` }}
            >
              {campaign.name[0]}
            </div>
            <p className="text-white font-bold text-2xl leading-tight truncate group-hover:text-brand-200 transition-colors">{campaign.name}</p>
            <p className="text-surface-400 text-lg mt-2">{campaign.brand}</p>
          </div>
          <CampaignStatusPill status={campaign.status} />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-surface-800/50 rounded-2xl p-6 border border-surface-700/50">
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider">Reach</p>
            <p className="text-white font-bold text-3xl mt-3">{formatNumber(kpis.totalReach)}</p>
          </div>
          <div className="bg-surface-800/50 rounded-2xl p-6 border border-surface-700/50">
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider">Avg ER</p>
            <p className="text-white font-bold text-3xl mt-3">{kpis.avgEngagementRate > 0 ? kpis.avgEngagementRate.toFixed(1) + '%' : '—'}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-surface-400 text-base font-semibold">Deliverables</span>
            <span className="text-surface-200 text-base font-bold">{kpis.completedCount + kpis.liveCount}/{kpis.deliverableCount} done</span>
          </div>
          <ProgressBar pct={kpis.progressPct} color="brand" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-8 border-t border-surface-700/50">
          <div className="flex items-center gap-4 text-surface-400 text-lg">
            <Users size={20} />
            <span className="font-semibold">{creators.length} creators</span>
          </div>
          <span className={`text-lg font-bold ${daysLeft < 0 ? 'text-surface-500' : daysLeft < 7 ? 'text-rose-400' : 'text-surface-400'}`}>
            {daysLeft < 0 ? 'Ended' : `${daysLeft}d left`}
          </span>
        </div>
      </div>
    </Link>
  );
}