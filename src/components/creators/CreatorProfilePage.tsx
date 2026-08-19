import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Mail, ExternalLink, Sparkles, Users, BarChart2, CheckCircle, Target } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { getCreatorOverallMetrics, getCampaignsForCreator } from '../../store/selectors';
import {
  PlatformBadge, DeliverableStatusPill, CampaignStatusPill,
  Avatar, StatCard, formatNumber
} from '../shared';

export default function CreatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();

  const creator = state.creators.find(c => c.id === id);
  if (!creator) return (
    <div className="flex items-center justify-center py-32 text-surface-400">Creator not found.</div>
  );

  const metrics = getCreatorOverallMetrics(state, id!);
  const campaigns = getCampaignsForCreator(state, id!);
  const deliverables = state.deliverables.filter(d => d.creatorId === id);

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/creators')} className="flex items-center gap-3 text-surface-400 hover:text-white transition-colors text-base font-medium cursor-pointer w-fit group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" /> Back to Creators
      </button>

      {/* Profile Header */}
      <div className="glass-card p-8">
        <div className="flex items-start gap-8">
          <Avatar src={creator.avatar} name={creator.name} size="xl" />
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-4xl font-bold flex items-center gap-3">
              {creator.name}
              <Sparkles size={24} className="text-brand-400 animate-pulse-glow" />
            </h2>
            <div className="flex items-center gap-6 mt-3 flex-wrap">
              {creator.location && (
                <span className="flex items-center gap-2 text-surface-400 text-base">
                  <MapPin size={16} className="text-brand-400" />{creator.location}
                </span>
              )}
              {creator.email && (
                <a href={`mailto:${creator.email}`} className="flex items-center gap-2 text-surface-400 hover:text-brand-300 text-base transition-colors">
                  <Mail size={16} className="text-accent-400" />{creator.email}
                </a>
              )}
            </div>
            {creator.bio && <p className="text-surface-400 text-lg mt-5 max-w-2xl leading-relaxed">{creator.bio}</p>}
            <div className="flex flex-wrap gap-3 mt-5">
              {creator.niche.map(n => (
                <span key={n} className="px-4 py-2 bg-brand-600/20 text-brand-300 text-sm font-bold rounded-xl border border-brand-500/40">{n}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Platform profiles */}
        <div className="mt-8 pt-8 border-t border-surface-700/50">
          <h3 className="text-surface-300 text-sm font-bold uppercase tracking-wider mb-5">Social Platforms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {creator.platforms.map(p => (
              <div key={p.platform} className="flex items-center gap-5 px-6 py-4 bg-surface-800/60 rounded-2xl border border-surface-700/50 hover:border-brand-500/30 transition-all duration-300">
                <PlatformBadge platform={p.platform} size="lg" />
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">{p.handle}</p>
                  <p className="text-surface-400 text-base">{formatNumber(p.followers)} followers</p>
                </div>
                {p.verified && (
                  <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shrink-0 glow-brand" title="Verified">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M19.28 7.32a1 1 0 00-1.09-.22l-3.5 1.17a1 1 0 01-1.18-.34l-1.5-2.6a1 1 0 00-1.73-.01l-1.5 2.6a1 1 0 01-1.18.34l-3.5-1.17a1 1 0 00-1.09.22l-1.5 2.6a1 1 0 00.22 1.31l2.83 2.83a1 1 0 010 1.41l-2.83 2.83a1 1 0 00-.22 1.31l1.5 2.6a1 1 0 001.09.22l3.5-1.17a1 1 0 011.18.34l1.5 2.6a1 1 0 001.73.01l1.5-2.6a1 1 0 011.18-.34l3.5 1.17a1 1 0 001.09-.22l1.5-2.6a1 1 0 00-.22-1.31l-2.83-2.83a1 1 0 010-1.41l2.83-2.83a1 1 0 00.22-1.31l-1.5-2.6zM9 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Total Reach" value={formatNumber(metrics.totalReach)} icon={<Users size={20} />} />
        <StatCard label="Total Impressions" value={formatNumber(metrics.totalImpressions)} icon={<BarChart2 size={20} />} />
        <StatCard label="Total Engagements" value={formatNumber(metrics.totalEngagements)} icon={<CheckCircle size={20} />} />
        <StatCard
          label="Avg Eng. Rate"
          value={metrics.avgEngagementRate > 0 ? metrics.avgEngagementRate.toFixed(1) + '%' : '—'}
          icon={<Target size={20} />}
        />
      </div>

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <div className="glass-card p-8">
          <h3 className="text-white font-bold text-xl mb-6">Campaigns ({campaigns.length})</h3>
          <div className="flex flex-col gap-4">
            {campaigns.map(c => (
              <Link key={c.id} to={`/campaigns/${c.id}`}
                className="flex items-center gap-5 p-5 rounded-2xl bg-surface-800/50 border border-surface-700/50 hover:bg-surface-800 hover:border-brand-500/50 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${c.coverColor}dd, ${c.coverColor}77)` }}
                >
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-lg group-hover:text-brand-300 transition-colors truncate">{c.name}</p>
                  <p className="text-surface-400 text-base mt-1">{c.brand}</p>
                </div>
                <CampaignStatusPill status={c.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <div className="glass-card p-0">
          <div className="p-8">
            <h3 className="text-white font-bold text-xl">Deliverables ({deliverables.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead className="bg-surface-800/40">
                <tr className="border-b border-surface-700">
                  {['Campaign', 'Platform', 'Type', 'Description', 'Due Date', 'Status', 'Content'].map(h => (
                    <th key={h} className="text-surface-400 text-left py-4 px-6 text-xs font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/50">
                {deliverables.map(d => {
                  const campaign = state.campaigns.find(c => c.id === d.campaignId);
                  return (
                    <tr key={d.id} className="hover:bg-surface-800/30 transition-colors">
                      <td className="py-4 px-6 text-surface-300 font-semibold">{campaign?.name ?? '—'}</td>
                      <td className="py-4 px-6"><PlatformBadge platform={d.platform} /></td>
                      <td className="py-4 px-6 text-surface-400 capitalize">{d.type}</td>
                      <td className="py-4 px-6 text-surface-300 max-w-xs truncate">{d.description}</td>
                      <td className="py-4 px-6 text-surface-400">{d.dueDate}</td>
                      <td className="py-4 px-6"><DeliverableStatusPill status={d.status} /></td>
                      <td className="py-4 px-6">
                        {d.postUrl ? (
                          <a href={d.postUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-2">
                            <ExternalLink size={14} /> View
                          </a>
                        ) : d.contentUrl ? (
                          <a href={d.contentUrl} target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-white flex items-center gap-2">
                            <ExternalLink size={14} /> Draft
                          </a>
                        ) : <span className="text-surface-600">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}