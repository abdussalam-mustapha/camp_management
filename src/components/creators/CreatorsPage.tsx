import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Users, Sparkles } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { getCreatorOverallMetrics } from '../../store/selectors';
import { PlatformBadge, Button, Avatar, EmptyState, formatNumber, Modal, Input, Select } from '../shared';
import type { Creator, Platform, PlatformProfile } from '../../data/types';
import { v4 as uuid } from 'uuid';

export default function CreatorsPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = state.creators.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.niche.some(n => n.toLowerCase().includes(search.toLowerCase())) ||
    c.platforms.some(p => p.handle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Creator Pool
            <Sparkles size={24} className="text-brand-400 animate-pulse-glow" />
          </h2>
          <p className="text-surface-400 text-base mt-2">{state.creators.length} creators in your roster</p>
        </div>
        {state.currentRole === 'agency' && (
          <Button onClick={() => setShowAdd(true)} size="lg" className="btn-premium">
            <Plus size={18} /> Add Creator
          </Button>
        )}
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, niche, or handle..."
          className="input-premium w-full rounded-2xl pl-12 pr-6 py-4 text-surface-200 text-base placeholder-surface-500"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={32} />} title="No creators found"
          description="Add creators to build your roster"
          action={state.currentRole === 'agency' ? <Button onClick={() => setShowAdd(true)}><Plus size={16} /> Add Creator</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filtered.map(c => <CreatorCard key={c.id} creator={c} />)}
        </div>
      )}

      <AddCreatorModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}

function CreatorCard({ creator }: { creator: Creator }) {
  const { state } = useApp();
  const metrics = getCreatorOverallMetrics(state, creator.id);
  const totalFollowers = creator.platforms.reduce((s, p) => s + p.followers, 0);

  return (
    <Link to={`/creators/${creator.id}`} className="block group">
      <div className="glass-card p-10 hover:border-brand-500/50 transition-all duration-500 h-full flex flex-col gap-8 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-brand-500/10">
        {/* Header */}
        <div className="flex items-start gap-8">
          <Avatar src={creator.avatar} name={creator.name} size="xl" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-2xl truncate group-hover:text-brand-200 transition-colors">{creator.name}</p>
            <p className="text-surface-400 text-lg mt-2">{creator.location}</p>
          </div>
        </div>

        {/* Niche */}
        <div className="flex flex-wrap gap-4">
          {creator.niche.slice(0, 3).map(n => (
            <span key={n} className="px-4 py-2 bg-surface-800/50 text-surface-300 text-sm rounded-2xl font-bold border border-surface-700/50">{n}</span>
          ))}
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap gap-x-6 gap-y-4 items-center">
          {creator.platforms.map(p => (
            <div key={p.platform} className="flex items-center gap-4">
              <PlatformBadge platform={p.platform} />
              <span className="text-surface-300 text-lg font-bold">{formatNumber(p.followers)}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-auto pt-8 border-t border-surface-700/50">
          <div className="text-center">
            <p className="text-white font-bold text-3xl">{formatNumber(totalFollowers)}</p>
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mt-2">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-3xl">{metrics.activeCampaigns.length}</p>
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mt-2">Campaigns</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-3xl">
              {metrics.avgEngagementRate > 0 ? metrics.avgEngagementRate.toFixed(1) + '%' : '—'}
            </p>
            <p className="text-surface-400 text-xs font-bold uppercase tracking-wider mt-2">Avg ER</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AddCreatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [niche, setNiche] = useState('');
  const [platforms, setPlatforms] = useState<PlatformProfile[]>([
    { platform: 'instagram', handle: '', followers: 0, verified: false },
  ]);

  const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'x', label: 'X (Twitter)' },
  ];

  function addPlatform() {
    setPlatforms(prev => [...prev, { platform: 'tiktok', handle: '', followers: 0, verified: false }]);
  }

  function updatePlatform(i: number, field: keyof PlatformProfile, value: string | number | boolean) {
    setPlatforms(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  function handleSubmit() {
    if (!name || !email) return;
    const creator: Creator = {
      id: `cr${uuid().slice(0, 8)}`,
      name, email, bio, location,
      niche: niche.split(',').map(n => n.trim()).filter(Boolean),
      platforms: platforms.filter(p => p.handle),
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'CREATOR_ADD', payload: creator });
    setName(''); setEmail(''); setBio(''); setLocation(''); setNiche('');
    setPlatforms([{ platform: 'instagram', handle: '', followers: 0, verified: false }]);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Creator" size="lg">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Full Name *" value={name} onChange={e => setName(e.target.value)} placeholder="Creator name" />
          <Input label="Email *" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="creator@email.com" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
          <Input label="Niche (comma separated)" value={niche} onChange={e => setNiche(e.target.value)} placeholder="Beauty, Lifestyle, Fashion" />
        </div>
        <Input label="Bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Short creator bio..." />

        <div>
          <label className="text-surface-300 text-sm font-bold block mb-3">Social Platforms</label>
          <div className="flex flex-col gap-3">
            {platforms.map((p, i) => (
              <div key={i} className="grid grid-cols-[140px_1fr_120px] gap-4">
                <Select
                  value={p.platform}
                  onChange={e => updatePlatform(i, 'platform', e.target.value)}
                  options={PLATFORM_OPTIONS}
                />
                <Input value={p.handle} onChange={e => updatePlatform(i, 'handle', e.target.value)} placeholder="@handle" />
                <Input type="number" value={p.followers || ''} onChange={e => updatePlatform(i, 'followers', Number(e.target.value))} placeholder="Followers" />
              </div>
            ))}
            <Button variant="ghost" size="md" onClick={addPlatform} className="self-start mt-2">
              <Plus size={16} /> Add Platform
            </Button>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={!name || !email}>Add Creator</Button>
        </div>
      </div>
    </Modal>
  );
}