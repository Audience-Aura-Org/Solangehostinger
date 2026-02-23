'use client';

import { useEffect, useState } from 'react';

type Dispute = {
    _id: string;
    bookingId: any;
    clientEmail: string;
    subject: string;
    reason: string;
    status: string;
    adminNotes?: string;
    createdAt: string;
};

export default function AdminDisputesPage() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
    const [updateForm, setUpdateForm] = useState({ status: '', adminNotes: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/disputes')
            .then(r => r.json())
            .then(data => {
                setDisputes(data.disputes || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDispute) return;
        setSaving(true);
        try {
            const res = await fetch('/api/admin/disputes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedDispute._id,
                    ...updateForm
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setDisputes(disputes.map(d => d._id === data.dispute._id ? data.dispute : d));
                setSelectedDispute(null);
                alert('Dispute updated.');
            }
        } catch (err) {
            alert('Error updating dispute.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl space-y-10">
            <div className="border-b border-[#141414] pb-8 flex justify-between items-end">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#404040] mb-3">Concierge Desk</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#FDFBF7] tracking-tight leading-none">Disputes</h1>
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-[#404040]">
                    {disputes.length} active issues
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-[9px] uppercase tracking-widest text-[#404040] animate-pulse">
                    Scanning records...
                </div>
            ) : disputes.length === 0 ? (
                <div className="p-20 border border-dashed border-[#141414] text-center">
                    <p className="text-[9px] uppercase tracking-widest text-[#404040]">The ledger is clear. No active disputes.</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        {disputes.map(d => (
                            <button
                                key={d._id}
                                onClick={() => {
                                    setSelectedDispute(d);
                                    setUpdateForm({ status: d.status, adminNotes: d.adminNotes || '' });
                                }}
                                className={`w-full text-left p-6 border transition-all ${selectedDispute?._id === d._id ? 'border-[#C5A059] bg-[#0A0A0A]' : 'border-[#141414] bg-[#060606] hover:border-[#222]'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[7px] uppercase tracking-widest px-2 py-0.5 ${d.status === 'resolved' ? 'border border-green-500/30 text-green-500' :
                                            d.status === 'pending' ? 'border border-[#C5A059]/30 text-[#C5A059]' : 'border border-[#333] text-[#404040]'
                                        }`}>
                                        {d.status}
                                    </span>
                                    <span className="text-[8px] text-[#404040] font-mono">
                                        {new Date(d.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-sm font-serif text-[#FDFBF7] mb-1">{d.subject}</h3>
                                <p className="text-[9px] text-[#8A8070] uppercase tracking-widest">{d.clientEmail}</p>
                            </button>
                        ))}
                    </div>

                    <div className="sticky top-10">
                        {selectedDispute ? (
                            <div className="border border-[#141414] bg-[#080808] p-8 space-y-8">
                                <div>
                                    <p className="text-[8px] uppercase tracking-[0.4em] text-[#C5A059] mb-6">Dispute Details</p>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-[#404040] mb-1">Subject</p>
                                            <p className="text-sm text-[#FDFBF7] font-serif">{selectedDispute.subject}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-[#404040] mb-1">Reason / Complaint</p>
                                            <p className="text-xs text-[#8A8070] leading-relaxed bg-[#0A0A0A] p-4 border border-[#141414]">{selectedDispute.reason}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-[#404040] mb-1">Booking Confirmation</p>
                                            <p className="text-[10px] text-[#C5A059] font-mono">{selectedDispute.bookingId?.confirmationNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdate} className="pt-8 border-t border-[#141414] space-y-6">
                                    <div>
                                        <label className="block text-[8px] uppercase tracking-[0.25em] text-[#404040] mb-3">Update Status</label>
                                        <select
                                            value={updateForm.status}
                                            onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                                            className="w-full bg-[#0A0A0A] border border-[#1A1A1A] px-4 py-3 text-[10px] uppercase tracking-widest text-[#FDFBF7] focus:outline-none focus:border-[#C5A059]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[8px] uppercase tracking-[0.25em] text-[#404040] mb-3">Internal Resolution Notes</label>
                                        <textarea
                                            rows={4}
                                            value={updateForm.adminNotes}
                                            onChange={e => setUpdateForm({ ...updateForm, adminNotes: e.target.value })}
                                            placeholder="Document the resolution or internal findings..."
                                            className="w-full bg-[#0A0A0A] border border-[#1A1A1A] p-4 text-[11px] text-[#FDFBF7] focus:outline-none focus:border-[#C5A059]"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit" disabled={saving}
                                        className="w-full bg-[#FDFBF7] text-[#080808] py-4 text-[9px] uppercase tracking-[0.35em] font-semibold hover:bg-[#C5A059] transition-colors disabled:opacity-50"
                                    >
                                        {saving ? 'Recording...' : 'Finalize Decision'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="h-[400px] border border-[#141414] bg-[#060606] flex flex-col items-center justify-center text-center p-12">
                                <span className="text-4xl text-[#141414] mb-4">◇</span>
                                <p className="text-[9px] uppercase tracking-widest text-[#404040]">Select a dispute from the ledger to review and resolve.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
