'use client';

import { useEffect, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────
type Addon = {
    _id?: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    linkedCategories: string[];
    linkedSizes: string[];
    active: boolean;
};

// Fallback mirror of the service catalogue for linking
const DEFAULT_SERVICE_CATALOGUE = [
    {
        id: 'box-braids', name: 'Premium Box Braids',
        sizes: [{ id: 'bb-s', size: 'Small' }, { id: 'bb-m', size: 'Medium' }, { id: 'bb-l', size: 'Large' }],
    },
    {
        id: 'knotless-braids', name: 'Knotless Braids',
        sizes: [{ id: 'kb-s', size: 'Small' }, { id: 'kb-m', size: 'Medium' }, { id: 'kb-l', size: 'Large' }],
    },
    {
        id: 'cornrows', name: 'Signature Cornrows',
        sizes: [{ id: 'cr-s', size: 'Small / Detailed' }, { id: 'cr-m', size: 'Medium' }, { id: 'cr-l', size: 'Large' }],
    },
];

const EMPTY_ADDON: Addon = {
    name: '', description: '', price: 0, duration: 0,
    linkedCategories: [], linkedSizes: [], active: true,
};

// ─── Toggle Helper ─────────────────────────────────────────────
function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

// ─── Linkage Selector Subcomponent ────────────────────────────
function LinkageSelector({ addon, services, onChange }: {
    addon: Addon;
    services: any[];
    onChange: (updated: Addon) => void;
}) {
    return (
        <div className="space-y-4">
            {services.map(cat => {
                const catLinked = addon.linkedCategories.includes(cat.id);
                return (
                    <div key={cat.id} className="border border-[#141414]">
                        {/* Category Row */}
                        <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#0A0A0A] transition-colors border-b border-[#0E0E0E]">
                            <span
                                onClick={() => onChange({ ...addon, linkedCategories: toggle(addon.linkedCategories, cat.id) })}
                                className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${catLinked ? 'border-[#C5A059] bg-[#C5A059]/20' : 'border-[#333]'}`}
                            >
                                {catLinked && <span className="text-[#C5A059] text-[7px]">✓</span>}
                            </span>
                            <span className="text-[10px] text-[#FDFBF7] uppercase tracking-widest">{cat.name}</span>
                            {catLinked && (
                                <span className="text-[8px] text-[#C5A059] ml-auto">All sizes included</span>
                            )}
                        </label>

                        {/* Size Rows */}
                        <div className="px-8 py-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {cat.sizes.map((sz: any) => {
                                const szLinked = addon.linkedSizes.includes(sz.id);
                                return (
                                    <label
                                        key={sz.id}
                                        className="flex items-center gap-2 py-1.5 cursor-pointer group"
                                        onClick={() => onChange({ ...addon, linkedSizes: toggle(addon.linkedSizes, sz.id) })}
                                    >
                                        <span className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center transition-colors ${szLinked ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-[#282828] group-hover:border-[#404040]'}`}>
                                            {szLinked && <span className="text-[#C5A059] text-[6px]">✓</span>}
                                        </span>
                                        <span className={`text-[9px] uppercase tracking-[0.15em] transition-colors ${szLinked ? 'text-[#C5A059]' : 'text-[#404040] group-hover:text-[#606060]'}`}>
                                            {sz.size}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Addon Form Modal ─────────────────────────────────────────
function AddonForm({ initial, services, onSave, onCancel }: {
    initial: Addon;
    services: any[];
    onSave: (a: Addon) => void;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<Addon>(initial);
    const set = (key: keyof Addon, val: unknown) => setForm(f => ({ ...f, [key]: val }));

    return (
        <div className="border border-[#C5A059]/20 bg-[#060606] p-6 space-y-6">
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#C5A059]">
                {initial._id ? 'Edit Addon' : 'New Addon'}
            </p>

            {/* Basic Fields */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="text-[8px] uppercase tracking-[0.2em] text-[#404040] block mb-1">Addon Name *</label>
                    <input
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="e.g. Hair Dye, Wig Cap, Colour Rinse..."
                        className="w-full bg-transparent border-b border-[#333] py-1.5 text-xs text-[#FDFBF7] focus:border-[#C5A059] outline-none"
                    />
                </div>
                <div>
                    <label className="text-[8px] uppercase tracking-[0.2em] text-[#404040] block mb-1">Short Description</label>
                    <input
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                        placeholder="Optional..."
                        className="w-full bg-transparent border-b border-[#333] py-1.5 text-xs text-[#606060] focus:border-[#C5A059] outline-none"
                    />
                </div>
                <div>
                    <label className="text-[8px] uppercase tracking-[0.2em] text-[#404040] block mb-1">Additional Price ($)</label>
                    <input
                        type="number" min={0}
                        value={form.price}
                        onChange={e => set('price', Number(e.target.value))}
                        className="w-full bg-transparent border-b border-[#333] py-1.5 text-xs text-[#C5A059] focus:border-[#C5A059] outline-none tabular-nums"
                    />
                </div>
                <div>
                    <label className="text-[8px] uppercase tracking-[0.2em] text-[#404040] block mb-1">Extra Duration (min)</label>
                    <input
                        type="number" min={0}
                        value={form.duration}
                        onChange={e => set('duration', Number(e.target.value))}
                        className="w-full bg-transparent border-b border-[#333] py-1.5 text-xs text-[#606060] focus:border-[#C5A059] outline-none tabular-nums"
                    />
                </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
                <span
                    onClick={() => set('active', !form.active)}
                    className={`w-8 h-4 border flex items-center transition-all cursor-pointer relative ${form.active ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-[#333]'}`}
                >
                    <span className={`w-2.5 h-2.5 bg-[#C5A059] absolute transition-all ${form.active ? 'left-[14px]' : 'left-[2px] opacity-30'}`} />
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#404040]">Active (shown on booking page)</span>
            </div>

            {/* Linkage Selector */}
            <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#404040] mb-4">Link to Services &amp; Sizes</p>
                <LinkageSelector addon={form} services={services} onChange={setForm} />
            </div>

            {/* Actions */}
            <div className="flex gap-6 pt-2 border-t border-[#141414]">
                <button
                    onClick={() => onSave(form)}
                    disabled={!form.name.trim()}
                    className="text-[9px] uppercase tracking-widest text-[#C5A059] border-b border-[#C5A059]/40 pb-1 hover:text-[#FDFBF7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    {initial._id ? 'Update Addon' : 'Create Addon'}
                </button>
                <button
                    onClick={onCancel}
                    className="text-[9px] uppercase tracking-widest text-[#404040] hover:text-[#606060] transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────
export default function AdminAddonsPage() {
    const [addons, setAddons] = useState<Addon[]>([]);
    const [services, setServices] = useState<any[]>(DEFAULT_SERVICE_CATALOGUE);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState<Addon | null>(null);

    useEffect(() => {
        Promise.all([
            fetch('/api/admin/addons').then(r => r.json()),
            fetch('/api/admin/siteSettings').then(r => r.json())
        ])
            .then(([addonsData, settingsData]) => {
                setAddons(addonsData.addons || []);
                const dbServices = settingsData.settings?.services;
                if (dbServices && dbServices.length > 0) {
                    setServices(dbServices);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async (addon: Addon) => {
        if (addon._id) {
            // Update
            const res = await fetch(`/api/admin/addons/${addon._id}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addon),
            });
            const d = await res.json();
            setAddons(prev => prev.map(a => a._id === d.addon._id ? d.addon : a));
        } else {
            // Create
            const res = await fetch('/api/admin/addons', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addon),
            });
            const d = await res.json();
            setAddons(prev => [d.addon, ...prev]);
        }
        setShowForm(false);
        setEditTarget(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this addon permanently?')) return;
        await fetch(`/api/admin/addons/${id}`, { method: 'DELETE' });
        setAddons(prev => prev.filter(a => a._id !== id));
    };

    const startEdit = (a: Addon) => { setEditTarget(a); setShowForm(false); };

    const cancelForm = () => { setShowForm(false); setEditTarget(null); };

    return (
        <div className="max-w-4xl space-y-10">

            {/* Header */}
            <div className="border-b border-[#141414] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#404040] mb-3">Add-ons</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#FDFBF7] tracking-tight leading-none">Addons</h1>
                </div>
                {!showForm && !editTarget && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] border-b border-[#C5A059]/40 pb-1 hover:text-[#FDFBF7] transition-colors"
                    >
                        + New Addon
                    </button>
                )}
            </div>

            {/* Create Form */}
            {showForm && (
                <AddonForm initial={EMPTY_ADDON} services={services} onSave={handleSave} onCancel={cancelForm} />
            )}

            {/* Edit Form */}
            {editTarget && (
                <AddonForm initial={editTarget} services={services} onSave={handleSave} onCancel={cancelForm} />
            )}

            {/* Existing Addons List */}
            <div>
                {loading ? (
                    <div className="py-12 text-center text-[9px] uppercase tracking-widest text-[#404040] animate-pulse">
                        Loading addons...
                    </div>
                ) : addons.length === 0 ? (
                    <div className="border border-[#141414] border-dashed py-16 text-center text-[9px] uppercase tracking-widest text-[#303030]">
                        No addons created yet.
                    </div>
                ) : (
                    <div className="border border-[#141414] bg-[#060606] divide-y divide-[#0E0E0E]">
                        {addons.map((a, i) => (
                            <div key={a._id ?? i} className="flex items-start justify-between px-6 py-5 group hover:bg-[#080808] transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.active ? 'bg-[#C5A059]' : 'bg-[#303030]'}`} />
                                        <span className="text-xs text-[#FDFBF7] font-serif">{a.name}</span>
                                        <span className="text-[10px] text-[#C5A059] tabular-nums ml-auto">+${a.price}</span>
                                    </div>
                                    {a.description && (
                                        <p className="text-[9px] text-[#404040] ml-4">{a.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-2 ml-4">
                                        {a.duration > 0 && (
                                            <span className="text-[8px] uppercase tracking-widest text-[#404040]">+{a.duration}min</span>
                                        )}
                                        {a.linkedCategories.map(cid => {
                                            const cat = services.find((c: any) => c.id === cid);
                                            return cat ? (
                                                <span key={cid} className="text-[8px] uppercase tracking-widest text-[#303030] border border-[#222] px-2 py-0.5">
                                                    {cat.name}
                                                </span>
                                            ) : null;
                                        })}
                                        {a.linkedSizes.map(sid => {
                                            const sz = services.flatMap((c: any) => c.sizes).find((s: any) => s.id === sid);
                                            return sz ? (
                                                <span key={sid} className="text-[8px] uppercase tracking-widest text-[#303030] border border-[#1A1A1A] px-2 py-0.5">
                                                    {sz.size}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                                <div className="flex gap-4 ml-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <button onClick={() => startEdit(a)} className="text-[8px] uppercase tracking-widest text-[#C5A059]/60 hover:text-[#C5A059] transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(a._id!)} className="text-[8px] uppercase tracking-widest text-[#303030] hover:text-red-500/80 transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
