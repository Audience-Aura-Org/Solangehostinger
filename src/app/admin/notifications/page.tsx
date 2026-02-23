'use client';

import { useEffect, useState } from 'react';

type Notification = {
    _id: string;
    clientName: string;
    type: string;
    status: string;
    message: string;
    createdAt: string;
};

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/notifications');
        const data = await res.json();
        setNotifications(data.notifications || []);
        setLoading(false);
    };

    useEffect(() => { fetchNotifications(); }, []);

    const getTypeColor = (type: string) => {
        if (type.includes('2h')) return 'text-[#C5A059]';
        if (type.includes('30m')) return 'text-amber-500';
        if (type.includes('cancel')) return 'text-red-500';
        return 'text-blue-400';
    };

    return (
        <div className="max-w-6xl space-y-10">
            {/* Header */}
            <div className="border-b border-[#141414] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500 mb-3">Logs</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#FDFBF7] tracking-tight leading-none">Notifications</h1>
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-medium">
                    {notifications.length} alerts recorded
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center text-[9px] uppercase tracking-widest text-gray-500 animate-pulse font-serif">
                        Synchronizing logs...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="border border-[#141414] bg-[#060606] p-12 text-center">
                        <p className="text-[9px] uppercase tracking-widest text-[#404040]">No notification events on record.</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div key={n._id} className="border border-[#141414] bg-[#060606] p-6 flex items-center justify-between group hover:border-[#C5A059]/30 transition-colors">
                            <div className="flex items-center gap-6">
                                <div className={`w-1 h-10 ${getTypeColor(n.type)} bg-current opacity-20`}></div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-[8px] uppercase tracking-widest font-bold ${getTypeColor(n.type)}`}>
                                            {n.type.replace('_', ' ')}
                                        </span>
                                        <span className="text-[9px] text-gray-500 font-mono">
                                            {new Date(n.createdAt).toLocaleTimeString()} · {new Date(n.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#FDFBF7] font-medium">{n.clientName}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{n.message}</p>
                                </div>
                            </div>
                            <div className="text-[10px] uppercase tracking-widest text-emerald-500/80 bg-emerald-500/5 px-3 py-1 border border-emerald-500/10">
                                {n.status}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
