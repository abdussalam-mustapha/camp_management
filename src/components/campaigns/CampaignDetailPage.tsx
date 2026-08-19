import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Target, Users, Hash, ExternalLink,
  CheckCircle, Clock, BarChart2, Plus, Link2, Sparkles
} from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { getCampaignKPIs } from '../../store/selectors';
import {
  CampaignStatusPill, DeliverableStatusPill, PlatformBadge,
  Button, Avatar, StatCard, formatNumber, Select, Modal, Input, Textarea
} from '../shared';
import type { Deliverable, DeliverableStatus, Platform, DeliverableType } from '../../data/types';
import { v4 as uuid } from 'uuid';

const WORKFLOW: DeliverableStatus[] = ['executing', 'in_review', 'approved', 'live', 'completed'];

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const campaign = state.campaigns.find(c => c.id === id);
  if (!campaign) return (
    <div className="flex items-center justify-center py-32 text-surface-400">Campaign not found.</div>
  );

  const creators = state.creators.filter(c => campaign.creatorIds.includes(c.id));
  const deliverables = state.deliverables.filter(d => d.campaignId === id);
  const kpis = getCampaignKPIs(state, id!);
  const [showAddDeliverable, setShowAddDeliverable] = useState(false);
  const [approvalModal, setApprovalModal] = useState<Deliverable | null>(null);
  const [revisionNote, setRevisionNote] = useState('');

  function advanceStatus(deliverableId: string, current: DeliverableStatus) {
    const next = WORKFLOW[WORKFLOW.indexOf(current) + 1];
    if (!next) return;
    dispatch({ type: 'DELIVERABLE_STATUS_UPDATE', payload: { id: deliverableId, status: next } });
  }

  function requestRevision(d: Deliverable) {
    dispatch({
      type: 'DELIVERABLE_STATUS_UPDATE',
      payload: { id: d.id, status: 'revision_requested', meta: { revisionNote } },
    });
    setApprovalModal(null);
    setRevisionNote('');
  }

  function approve(d: Deliverable) {
    dispatch({ type: 'DELIVERABLE_STATUS_UPDATE', payload: { id: d.id, status: 'approved' } });
    setApprovalModal(null);
  }

  const inReview = deliverables.filter(d => d.status === 'in_review');

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/campaigns')} className="flex items-center gap-3 text-surface-400 hover:text-white transition-colors text-base font-medium cursor-pointer w-fit group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" /> Back to Campaigns
      </button>

      {/* Header */}
      <div className="glass-card p-8">
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div className="flex items-start gap-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${campaign.coverColor}dd, ${campaign.coverColor}77)` }}
            >
              {campaign.name[0]}
            </div>
            <div>
              <h2 className="text-white text-3xl font-bold flex items-center gap-3">
                {campaign.name}
                <Sparkles size={20} className="text-brand-400 animate-pulse-glow" />
              </h2>
              <p className="text-surface-400 text-lg mt-2">{campaign.brand}</p>
              <p className="text-surface-500 text-base mt-3">{campaign.objective}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CampaignStatusPill status={campaign.status} />
            {state.currentRole === 'agency' && (
              <Link to={`/reports/${id}`}>
                <Button variant="secondary" size="md" className="btn-premium"><BarChart2 size={18} /> View Report</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-x-10 gap-y-4 mt-8 pt-8 border-t border-surface-700/50 flex-wrap">
          <div className="flex items-center gap-3 text-surface-400 text-base">
            <Calendar size={18} className="text-brand-400" />
            <span className="font-semibold">{campaign.startDate} — {campaign.endDate}</span>
          </div>
          <div className="flex items-center gap-3 text-surface-400 text-base">
            <Users size={18} className="text-accent-400" />
            <span className="font-semibold">{creators.length} creators</span>
          </div>
          <div className="flex items-center gap-3 text-surface-400 text-base">
            <Target size={18} className="text-sunset-400" />
            <span className="font-semibold">{deliverables.length} deliverables</span>
          </div>
          {campaign.budget && (
            <div className="flex items-center gap-3 text-surface-400 text-base">
              <span className="text-surface-500 font-semibold">Budget:</span>
              <span className="text-white font-bold text-lg">${campaign.budget.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Total Reach" value={formatNumber(kpis.totalReach)} icon={<Users size={20} />} />
        <StatCard label="Impressions" value={formatNumber(kpis.totalImpressions)} icon={<BarChart2 size={20} />} />
        <StatCard label="Engagements" value={formatNumber(kpis.totalEngagements)} icon={<CheckCircle size={20} />} />
        <StatCard label="Avg Eng. Rate" value={kpis.avgEngagementRate > 0 ? kpis.avgEngagementRate.toFixed(1) + '%' : '—'} icon={<Target size={20} />} />
      </div>

      {/* Content Approval Queue */}
      {inReview.length > 0 && (
        <div className="glass-card p-8 border-l-4 border-l-sunset-500">
          <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
            <Clock size={22} className="text-sunset-400" />
            Content Approval Queue
            <span className="ml-2 px-3 py-1 bg-sunset-500/20 text-sunset-300 text-sm font-bold rounded-full">{inReview.length}</span>
          </h3>
          <div className="flex flex-col gap-4">
            {inReview.map(d => {
              const creator = state.creators.find(c => c.id === d.creatorId);
              return (
                <div key={d.id} className="flex items-center gap-5 px-6 py-4 bg-surface-800/60 rounded-2xl border border-sunset-500/30 hover:border-sunset-500/50 transition-all duration-300">
                  <Avatar src={creator?.avatar} name={creator?.name ?? '?'} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-lg truncate">{d.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <PlatformBadge platform={d.platform} />
                      <span className="text-surface-400 text-base">{creator?.name}</span>
                      {d.contentUrl && (
                        <a href={d.contentUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 text-base flex items-center gap-2 font-medium">
                          <ExternalLink size={14} /> View Content
                        </a>
                      )}
                    </div>
                  </div>
                  {state.currentRole === 'agency' && (
                    <div className="flex gap-3 shrink-0">
                      <Button size="md" variant="danger" onClick={() => setApprovalModal(d)} className="btn-premium">Review</Button>
                      <Button size="md" onClick={() => approve(d)} className="btn-premium">Approve</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Creators & Deliverables */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-xl">Creator Roster & Deliverables</h3>
          {state.currentRole === 'agency' && (
            <Button size="md" variant="secondary" onClick={() => setShowAddDeliverable(true)} className="btn-premium">
              <Plus size={18} /> Add Deliverable
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-6">
          {creators.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-400 text-lg">No creators assigned to this campaign yet.</p>
            </div>
          ) : creators.map(creator => {
            const cDeliverables = deliverables.filter(d => d.creatorId === creator.id);
            return (
              <div key={creator.id} className="border border-surface-700/50 rounded-2xl overflow-hidden bg-surface-800/30">
                {/* Creator header */}
                <div className="flex items-center gap-5 px-6 py-4 bg-surface-800/50">
                  <Avatar src={creator.avatar} name={creator.name} size="lg" />
                  <div className="flex-1">
                    <Link to={`/creators/${creator.id}`} className="text-white font-bold text-lg hover:text-brand-300 transition-colors">{creator.name}</Link>
                    <div className="flex gap-2 mt-2">
                      {creator.platforms.map(p => <PlatformBadge key={p.platform} platform={p.platform} />)}
                    </div>
                  </div>
                  <div className="text-surface-400 text-base font-bold">{cDeliverables.length} deliverable{cDeliverables.length !== 1 ? 's' : ''}</div>
                </div>
                {/* Deliverables table */}
                {cDeliverables.length > 0 && (
                  <div className="divide-y divide-surface-700/50">
                    {cDeliverables.map(d => (
                      <DeliverableRow key={d.id} d={d} onAdvance={() => advanceStatus(d.id, d.status)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking Identifiers */}
      {campaign.trackingIdentifiers.length > 0 && (
        <div className="glass-card p-8">
          <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3"><Hash size={22} className="text-brand-400" /> Tracking Identifiers</h3>
          <div className="flex flex-wrap gap-5">
            {campaign.trackingIdentifiers.map(ti => (
              <div key={ti.id} className="flex items-center gap-4 px-5 py-3 bg-surface-800/60 rounded-xl border border-surface-700/50 hover:border-brand-500/30 transition-all duration-300">
                {ti.type === 'hashtag' && <Hash size={16} className="text-brand-400" />}
                {(ti.type === 'utm' || ti.type === 'referral_link') && <Link2 size={16} className="text-accent-400" />}
                {ti.type === 'coupon' && <span className="text-sunset-400 text-base font-bold">%</span>}
                <div>
                  <p className="text-surface-400 text-xs font-bold uppercase tracking-wider">{ti.type.replace('_', ' ')}</p>
                  <p className="text-white text-lg font-bold mt-1">{ti.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Deliverable Modal */}
      <AddDeliverableModal
        open={showAddDeliverable}
        onClose={() => setShowAddDeliverable(false)}
        campaignId={campaign.id}
        creators={creators}
      />

      {/* Revision Modal */}
      <Modal open={!!approvalModal} onClose={() => setApprovalModal(null)} title="Request Revision" size="sm">
        <div className="flex flex-col gap-5">
          <p className="text-surface-400 text-base">Provide feedback to the creator:</p>
          <Textarea
            label="Revision Notes"
            value={revisionNote}
            onChange={e => setRevisionNote(e.target.value)}
            rows={5}
            placeholder="What needs to be changed?"
          />
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setApprovalModal(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={() => approvalModal && requestRevision(approvalModal)} className="flex-1" disabled={!revisionNote}>
              Request Revision
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DeliverableRow({ d, onAdvance }: { d: Deliverable; onAdvance: () => void }) {
  const { state } = useApp();
  const canAdvance = d.status !== 'completed' && d.status !== 'revision_requested';
  const nextStatus: Record<DeliverableStatus, string> = {
    executing: 'Mark In Review',
    in_review: 'Approve',
    approved: 'Mark Live',
    live: 'Complete',
    completed: '',
    revision_requested: 'Resubmit',
  };

  return (
    <div className="flex items-center gap-5 px-6 py-4 hover:bg-surface-800/40 transition-all duration-300">
      <PlatformBadge platform={d.platform} />
      <div className="flex-1 min-w-0">
        <p className="text-surface-200 font-semibold text-base truncate">{d.description}</p>
        <p className="text-surface-400 text-sm mt-1">Due {d.dueDate} · {d.type}</p>
        {d.revisionNote && <p className="text-rose-400 text-sm mt-2 italic">"{d.revisionNote}"</p>}
      </div>
      <DeliverableStatusPill status={d.status} />
      {state.currentRole === 'agency' && canAdvance && nextStatus[d.status] && (
        <Button size="sm" variant="ghost" onClick={onAdvance} className="shrink-0 text-sm font-bold">
          {nextStatus[d.status]}
        </Button>
      )}
    </div>
  );
}

function AddDeliverableModal({ open, onClose, campaignId, creators }: {
  open: boolean; onClose: () => void; campaignId: string;
  creators: import('../../data/types').Creator[];
}) {
  const { dispatch } = useApp();
  const [creatorId, setCreatorId] = useState(creators[0]?.id ?? '');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [type, setType] = useState<DeliverableType>('reel');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const PLATFORMS: { value: Platform; label: string }[] = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'x', label: 'X (Twitter)' },
  ];

  const TYPES: { value: DeliverableType; label: string }[] = [
    { value: 'reel', label: 'Reel' },
    { value: 'post', label: 'Post' },
    { value: 'story', label: 'Story' },
    { value: 'video', label: 'Video' },
    { value: 'tweet', label: 'Tweet / Thread' },
    { value: 'short', label: 'Short' },
    { value: 'live', label: 'Live' },
  ];

  function handleSubmit() {
    if (!creatorId || !description || !dueDate) return;
    const d: Deliverable = {
      id: `d${uuid().slice(0, 8)}`,
      campaignId, creatorId, platform, type,
      description, dueDate,
      status: 'executing',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'DELIVERABLE_ASSIGN', payload: d });
    setDescription(''); setDueDate('');
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Deliverable" size="md">
      <div className="flex flex-col gap-5">
        <Select
          label="Creator"
          value={creatorId}
          onChange={e => setCreatorId(e.target.value)}
          options={creators.map(c => ({ value: c.id, label: c.name }))}
        />
        <div className="grid grid-cols-2 gap-6">
          <Select label="Platform" value={platform} onChange={e => setPlatform(e.target.value as Platform)} options={PLATFORMS} />
          <Select label="Content Type" value={type} onChange={e => setType(e.target.value as DeliverableType)} options={TYPES} />
        </div>
        <Textarea label="Description *" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe the content to be created..." />
        <Input label="Due Date *" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <div className="flex gap-4 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={!description || !dueDate || !creatorId}>Add Deliverable</Button>
        </div>
      </div>
    </Modal>
  );
}