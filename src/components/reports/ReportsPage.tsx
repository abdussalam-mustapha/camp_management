import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { BarChart2, Trophy, TrendingUp, ArrowUpDown, Plus, Edit2, Sparkles } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import {
  getCampaignKPIs, getCreatorMetricsForCampaign,
  getPlatformBreakdown, getTopContent
} from '../../store/selectors';
import {
  StatCard, Avatar, DeliverableStatusPill, PlatformBadge,
  formatNumber, Modal, Input, Button
} from '../shared';
import type { DeliverableMetrics } from '../../data/types';
import { v4 as uuid } from 'uuid';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#ec4899',
  tiktok: '#94a3b8',
  youtube: '#ef4444',
  facebook: '#3b82f6',
  x: '#64748b',
};

const CHART_COLORS = ['#8b5cf6', '#2dd4bf', '#f97316', '#ec4899', '#10b981', '#6366f1'];

export default function ReportsPage() {
  const { id: paramId } = useParams<{ id?: string }>();
  const { state } = useApp();
  const [selectedId, setSelectedId] = useState(paramId ?? state.campaigns[0]?.id ?? '');
  const [metricsModal, setMetricsModal] = useState<string | null>(null); // deliverableId
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const campaign = state.campaigns.find(c => c.id === selectedId);

  const kpis = campaign ? getCampaignKPIs(state, selectedId) : null;
  const creatorMetrics = campaign ? getCreatorMetricsForCampaign(state, selectedId) : [];
  const platformBreakdown = campaign ? getPlatformBreakdown(state, selectedId) : [];
  const topContent = campaign ? getTopContent(state, selectedId, 10) : [];

  // Comparison data
  const compareData = compareIds.map(cid => {
    const cr = creatorMetrics.find(m => m.creatorId === cid);
    return cr ?? null;
  }).filter(Boolean);

  function toggleCompare(creatorId: string) {
    setCompareIds(prev =>
      prev.includes(creatorId) ? prev.filter(id => id !== creatorId) : prev.length < 3 ? [...prev, creatorId] : prev
    );
  }

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Reports & Analytics
            <Sparkles size={24} className="text-brand-400 animate-pulse-glow" />
          </h2>
          <p className="text-surface-400 text-base mt-2">Campaign performance dashboard</p>
        </div>

        {/* Campaign selector */}
        <select
          value={selectedId}
          onChange={e => { setSelectedId(e.target.value); setCompareIds([]); }}
          className="input-premium rounded-xl px-6 py-3 text-white text-base min-w-[240px] cursor-pointer"
        >
          {state.campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {!campaign || !kpis ? (
        <div className="flex items-center justify-center py-32 text-surface-400 text-lg">
          No campaign selected or no data available.
        </div>
      ) : (
        <>
          {/* Campaign Info Bar */}
          <div className="glass-card p-8 flex items-center gap-6 flex-wrap">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ background: `linear-gradient(135deg, ${campaign.coverColor}cc, ${campaign.coverColor}44)` }}>
              {campaign.name[0]}
            </div>
            <div>
              <p className="text-white font-bold text-xl">{campaign.name}</p>
              <p className="text-surface-500 text-sm mt-1">{campaign.brand} · {campaign.startDate} — {campaign.endDate}</p>
            </div>
            <Link to={`/campaigns/${campaign.id}`} className="ml-auto text-brand-400 hover:text-brand-300 text-sm font-bold transition-colors">
              View Campaign →
            </Link>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard label="Total Reach" value={formatNumber(kpis.totalReach)} icon={<TrendingUp size={20} />} />
            <StatCard label="Impressions" value={formatNumber(kpis.totalImpressions)} icon={<BarChart2 size={20} />} />
            <StatCard label="Engagements" value={formatNumber(kpis.totalEngagements)} />
            <StatCard
              label="Avg Eng. Rate"
              value={kpis.avgEngagementRate > 0 ? kpis.avgEngagementRate.toFixed(2) + '%' : '—'}
              sub={`${kpis.deliverableCount} deliverables · ${kpis.progressPct}% complete`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Creator Performance Bar */}
            <div className="glass-card p-10">
              <h3 className="text-white font-bold mb-8 flex items-center gap-3 text-xl">
                <BarChart2 size={24} className="text-brand-400" /> Performance by Creator
              </h3>
              {creatorMetrics.length === 0 ? (
                <p className="text-surface-400 text-base py-20 text-center">No metric data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={creatorMetrics} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <XAxis dataKey="creatorName" tick={{ fill: '#a1a1aa', fontSize: 13 }} tickLine={false} axisLine={false}
                      tickFormatter={v => v.split(' ')[0]} />
                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 13 }} tickLine={false} axisLine={false}
                      tickFormatter={v => formatNumber(v)} />
                    <Tooltip
                      contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 12, color: '#f4f4f5' }}
                      formatter={(v: any) => [formatNumber(Number(v) || 0)]}
                      cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                    />
                    <Bar dataKey="totalReach" name="Reach" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={28} />
                    <Bar dataKey="totalEngagements" name="Engagements" fill="#2dd4bf" radius={[8, 8, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Platform Breakdown Donut */}
            <div className="glass-card p-10">
              <h3 className="text-white font-bold mb-8 flex items-center gap-3 text-xl">
                <ArrowUpDown size={24} className="text-accent-400" /> Performance by Platform
              </h3>
              {platformBreakdown.length === 0 ? (
                <p className="text-surface-400 text-base py-20 text-center">No metric data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={platformBreakdown} dataKey="reach" nameKey="platform" cx="50%" cy="50%"
                      outerRadius={110} innerRadius={75} paddingAngle={4}>
                      {platformBreakdown.map((entry) => (
                        <Cell key={entry.platform} fill={PLATFORM_COLORS[entry.platform] ?? '#8b5cf6'} stroke={'#18181b'} strokeWidth={3} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 12, color: '#f4f4f5' }}
                      formatter={(v: any, name: any) => [formatNumber(Number(v) || 0), String(name)]}
                    />
                    <Legend formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 14, fontWeight: 500 }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Creator Comparison */}
          <div className="glass-card p-10">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h3 className="text-white font-bold flex items-center gap-3 text-xl">
                <ArrowUpDown size={24} className="text-sunset-400" /> Creator Comparison
              </h3>
              <p className="text-surface-400 text-base">Select up to 3 creators to compare</p>
            </div>
            {/* Creator toggles */}
            <div className="flex flex-wrap gap-5 mb-10">
              {creatorMetrics.map(cm => (
                <button
                  key={cm.creatorId}
                  onClick={() => toggleCompare(cm.creatorId)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold border-2 transition-all cursor-pointer ${
                    compareIds.includes(cm.creatorId)
                      ? 'bg-brand-500/20 border-brand-500 text-brand-200 shadow-xl shadow-brand-500/30'
                      : 'bg-surface-800/50 border-surface-700/50 text-surface-300 hover:border-surface-600 hover:bg-surface-800/70'
                  }`}
                >
                  <Avatar src={cm.avatar} name={cm.creatorName} size="sm" />
                  {cm.creatorName}
                </button>
              ))}
            </div>
            {compareData.length >= 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {compareData.map((cm, idx) => cm && (
                  <div key={cm.creatorId} className="bg-surface-800/50 rounded-2xl p-8 border-2 border-surface-700/50 hover:border-brand-500/30 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-6 h-6 rounded-full" style={{ background: CHART_COLORS[idx] }} />
                      <p className="text-white font-bold text-2xl">{cm.creatorName}</p>
                    </div>
                    <div className="flex flex-col gap-5">
                      {[
                        { label: 'Reach', value: formatNumber(cm.totalReach) },
                        { label: 'Impressions', value: formatNumber(cm.totalImpressions) },
                        { label: 'Engagements', value: formatNumber(cm.totalEngagements) },
                        { label: 'Avg ER', value: cm.avgEngagementRate > 0 ? cm.avgEngagementRate.toFixed(1) + '%' : '—' },
                        { label: 'Deliverables', value: `${cm.completedCount}/${cm.deliverableCount}` },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between items-baseline">
                          <span className="text-surface-400 text-sm font-bold">{row.label}</span>
                          <span className="text-white text-xl font-bold">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-surface-400 text-base text-center py-12">Select at least 2 creators above to compare</p>
            )}
          </div>

          {/* Top Creators */}
          <div className="glass-card p-10">
            <h3 className="text-white font-bold mb-8 flex items-center gap-3 text-xl">
              <Trophy size={24} className="text-sunset-400" /> Top Performing Creators
            </h3>
            <div className="flex flex-col">
              {[...creatorMetrics].sort((a, b) => b.totalReach - a.totalReach).slice(0, 5).map((cm, i) => (
                <div key={cm.creatorId} className="flex items-center gap-8 py-6 border-b border-surface-700/50 last:border-b-0">
                  <span className="text-surface-500 text-3xl font-bold w-12 text-center">#{i + 1}</span>
                  <Link to={`/creators/${cm.creatorId}`} className="flex items-center gap-6 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                    <Avatar src={cm.avatar} name={cm.creatorName} size="lg" />
                    <span className="text-white text-xl font-semibold truncate">{cm.creatorName}</span>
                  </Link>
                  <div className="flex gap-16 shrink-0">
                    <div className="text-right">
                      <p className="text-white text-3xl font-bold">{formatNumber(cm.totalReach)}</p>
                      <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mt-2">Reach</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-3xl font-bold">{cm.avgEngagementRate > 0 ? cm.avgEngagementRate.toFixed(1) + '%' : '—'}</p>
                      <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mt-2">Avg ER</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-3xl font-bold">{cm.completedCount}/{cm.deliverableCount}</p>
                      <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mt-2">Done</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Content Table */}
          <div className="glass-card p-10">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h3 className="text-white font-bold flex items-center gap-3 text-xl">
                <TrendingUp size={24} className="text-accent-400" /> Top Performing Content
              </h3>
              {state.currentRole === 'agency' && (
                <Button size="md" onClick={() => setMetricsModal('new')} className="btn-premium">
                  <Plus size={18} /> Log Metrics
                </Button>
              )}
            </div>
            {topContent.length === 0 ? (
              <p className="text-surface-400 text-base text-center py-16">
                No performance data logged yet.{' '}
                {state.currentRole === 'agency' && (
                  <button onClick={() => setMetricsModal('new')} className="text-brand-400 hover:underline cursor-pointer font-bold">Log metrics for a deliverable</button>
                )}
              </p>
            ) : (
              <div className="overflow-x-auto -mx-10">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-surface-700/50">
                      {['Creator', 'Platform', 'Content', 'Reach', 'Impressions', 'Engagements', 'ER', 'Status', ''].map(h => (
                        <th key={h} className="text-surface-400 text-left py-5 px-10 text-xs font-bold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-700/50">
                    {topContent.map(({ deliverable: d, metrics: m, creator }) => (
                      <tr key={d.id} className="hover:bg-surface-800/40 transition-colors">
                        <td className="py-5 px-10">
                          <div className="flex items-center gap-5">
                            <Avatar src={creator?.avatar} name={creator?.name ?? '?'} size="md" />
                            <span className="text-surface-200 text-lg font-semibold truncate">{creator?.name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-10"><PlatformBadge platform={d.platform} /></td>
                        <td className="py-5 px-10 text-surface-300 text-lg max-w-sm">
                          <p className="truncate font-semibold text-surface-200">{d.description}</p>
                          <p className="text-surface-500 text-sm mt-1">{d.type}</p>
                        </td>
                        <td className="py-5 px-10 text-white text-lg font-bold">{formatNumber(m?.reach ?? 0)}</td>
                        <td className="py-5 px-10 text-surface-300 text-lg">{formatNumber(m?.impressions ?? 0)}</td>
                        <td className="py-5 px-10 text-surface-300 text-lg">{formatNumber((m?.likes ?? 0) + (m?.comments ?? 0) + (m?.shares ?? 0))}</td>
                        <td className="py-5 px-10">
                          <span className={`text-lg font-bold ${(m?.engagementRate ?? 0) > 5 ? 'text-accent-400' : 'text-surface-200'}`}>
                            {m?.engagementRate ? m.engagementRate.toFixed(1) + '%' : '—'}
                          </span>
                        </td>
                        <td className="py-5 px-10"><DeliverableStatusPill status={d.status} /></td>
                        <td className="py-5 px-10">
                          {state.currentRole === 'agency' && (
                            <button onClick={() => setMetricsModal(d.id)} className="text-surface-500 hover:text-brand-400 transition-colors cursor-pointer p-2">
                              <Edit2 size={20} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Metrics Log Modal */}
      {metricsModal && campaign && (
        <MetricsLogModal
          open={!!metricsModal}
          onClose={() => setMetricsModal(null)}
          campaignId={campaign.id}
          preselectedDeliverableId={metricsModal !== 'new' ? metricsModal : undefined}
        />
      )}
    </div>
  );
}

function MetricsLogModal({ open, onClose, campaignId, preselectedDeliverableId }: {
  open: boolean; onClose: () => void; campaignId: string; preselectedDeliverableId?: string;
}) {
  const { state, dispatch } = useApp();
  const deliverables = state.deliverables.filter(d => d.campaignId === campaignId && (d.status === 'live' || d.status === 'completed'));
  const [deliverableId, setDeliverableId] = useState(preselectedDeliverableId ?? deliverables[0]?.id ?? '');
  const [impressions, setImpressions] = useState('');
  const [reach, setReach] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [shares, setShares] = useState('');
  const [saves, setSaves] = useState('');
  const [views, setViews] = useState('');
  const [clicks, setClicks] = useState('');

  const existing = state.metrics.find(m => m.deliverableId === deliverableId);

  function handleSave() {
    const r = Number(reach) || 0;
    const l = Number(likes) || 0;
    const co = Number(comments) || 0;
    const sh = Number(shares) || 0;
    const er = r > 0 ? ((l + co + sh) / r) * 100 : 0;

    if (existing) {
      dispatch({
        type: 'METRICS_UPDATE',
        payload: {
          id: existing.id,
          changes: { impressions: Number(impressions), reach: r, likes: l, comments: co, shares: sh, saves: Number(saves), views: Number(views), clicks: Number(clicks), engagementRate: parseFloat(er.toFixed(2)) },
        },
      });
    } else {
      const m: DeliverableMetrics = {
        id: `m${uuid().slice(0, 8)}`,
        deliverableId,
        impressions: Number(impressions), reach: r, likes: l, comments: co, shares: sh,
        saves: Number(saves), views: Number(views), clicks: Number(clicks),
        engagementRate: parseFloat(er.toFixed(2)),
        loggedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'METRICS_LOG', payload: m });
    }
    onClose();
  }

  const deliverable = state.deliverables.find(d => d.id === deliverableId);
  const creator = deliverable ? state.creators.find(c => c.id === deliverable.creatorId) : null;

  return (
    <Modal open={open} onClose={onClose} title="Log Performance Metrics" size="md">
      <div className="flex flex-col gap-6">
        <div>
          <label className="text-surface-300 text-sm font-bold block mb-3">Select Deliverable</label>
          <select
            value={deliverableId} onChange={e => setDeliverableId(e.target.value)}
            className="input-premium w-full rounded-xl px-4 py-3 text-surface-200 text-base cursor-pointer"
          >
            {deliverables.map(d => {
              const cr = state.creators.find(c => c.id === d.creatorId);
              return <option key={d.id} value={d.id}>{cr?.name} — {d.type} ({d.platform})</option>;
            })}
          </select>
        </div>

        {deliverable && (
          <div className="p-4 bg-surface-800/50 rounded-xl border border-surface-700/50 text-sm text-surface-400">
            <p className="text-white text-base font-bold mb-1">{deliverable.description}</p>
            <p>{creator?.name} · {deliverable.platform} · {deliverable.type}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
          <Input label="Impressions" type="number" value={impressions} onChange={e => setImpressions(e.target.value)} placeholder="0" />
          <Input label="Reach" type="number" value={reach} onChange={e => setReach(e.target.value)} placeholder="0" />
          <Input label="Likes" type="number" value={likes} onChange={e => setLikes(e.target.value)} placeholder="0" />
          <Input label="Comments" type="number" value={comments} onChange={e => setComments(e.target.value)} placeholder="0" />
          <Input label="Shares" type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="0" />
          <Input label="Saves" type="number" value={saves} onChange={e => setSaves(e.target.value)} placeholder="0" />
          <Input label="Video Views" type="number" value={views} onChange={e => setViews(e.target.value)} placeholder="0" />
          <Input label="Clicks" type="number" value={clicks} onChange={e => setClicks(e.target.value)} placeholder="0" />
        </div>

        {reach && (likes || comments || shares) && (
          <div className="p-4 bg-brand-500/10 border border-brand-500/30 rounded-xl">
            <p className="text-brand-300 text-base font-semibold">
              Computed ER: <span className="font-bold">
                {(((Number(likes) + Number(comments) + Number(shares)) / Number(reach)) * 100).toFixed(2)}%
              </span>
            </p>
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="flex-1" disabled={!deliverableId}>
            {existing ? 'Update Metrics' : 'Log Metrics'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}