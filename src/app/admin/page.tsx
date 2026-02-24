'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Stats = {
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalClients: number;
  totalRevenue: number;
};

type Booking = {
  _id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  price: number;
  confirmationNumber: string;
};

const statusStyle = (s: string) => {
  if (s === 'confirmed') return 'text-[#C5A059]';
  if (s === 'completed') return 'text-emerald-400';
  if (s === 'cancelled') return 'text-red-500/70';
  return 'text-[#404040]';
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data.stats);
        setRecent(data.recentBookings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-12">

      {/* ─── Page Header ─── */}
      <div className="border-b border-[#141414] pb-8">
        <p className="text-[9px] uppercase tracking-[0.4em] text-[#404040] mb-3">{today}</p>
        <h1 className="text-4xl md:text-5xl font-serif text-[#FDFBF7] tracking-tight leading-none">
          Overview
        </h1>
      </div>

      {/* ─── KPI Strip ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[#141414]">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#060606] p-6 h-28 animate-pulse" />
          ))
        ) : stats ? (
          [
            { label: 'Total Bookings', value: stats.totalBookings },
            { label: 'Confirmed', value: stats.confirmedBookings, gold: true },
            { label: 'Completed', value: stats.completedBookings },
            { label: 'Clients', value: stats.totalClients },
            { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, gold: true },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[#060606] px-6 py-7 flex flex-col justify-between h-28 group hover:bg-[#0a0a0a] transition-colors">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#404040]">{kpi.label}</span>
              <span className={`text-3xl font-serif leading-none tabular-nums ${kpi.gold ? 'text-[#C5A059]' : 'text-[#FDFBF7]'}`}>
                {String(kpi.value)}
              </span>
            </div>
          ))
        ) : null}
      </div>

      {/* ─── Recent Bookings ─── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[9px] uppercase tracking-[0.4em] text-[#404040]">Recent Appointments</h2>
          <Link href="/admin/bookings" className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] hover:text-[#FDFBF7] transition-colors">
            View Ledger →
          </Link>
        </div>

        <div className="relative border border-[#141414] bg-[#060606] rounded-sm overflow-hidden">
          <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[#1A1A1A] max-h-[calc(100vh-200px)]">
            {loading ? (
              <div className="p-12 text-center text-[10px] uppercase tracking-widest text-[#404040] animate-pulse">
                Loading records...
              </div>
            ) : recent.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#404040] mb-4">No records yet</p>
                <Link href="/api/auth/seed" className="text-[10px] uppercase tracking-widest text-[#C5A059] hover:underline" target="_blank">
                  Initialize database →
                </Link>
              </div>
            ) : (
              <table className="w-full min-w-[1000px] table-fixed text-[10px] sm:text-sm">
                <thead>
                  <tr className="border-b border-[#141414] bg-[#0A0A0A]">
                    <th className="w-[120px] px-6 py-5 text-left text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Reference</th>
                    <th className="w-[180px] px-6 py-5 text-left text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Client</th>
                    <th className="w-[160px] px-6 py-5 text-left text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Service</th>
                    <th className="w-[140px] px-6 py-5 text-left text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Schedule</th>
                    <th className="w-[110px] px-6 py-5 text-left text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Status</th>
                    <th className="w-[100px] px-6 py-5 text-left text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="font-quicksand">
                  {recent.map((b, i) => (
                    <tr
                      key={b._id}
                      className={`group hover:bg-[#0A0A0A] transition-colors ${i !== recent.length - 1 ? 'border-b border-[#0E0E0E]' : ''}`}
                    >
                      <td className="px-6 py-6 text-[10px] font-mono text-gray-500 whitespace-nowrap">
                        #{b.confirmationNumber?.slice(-8).toUpperCase() ?? '—'}
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-semibold text-[#FDFBF7] truncate">{b.clientName}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] uppercase tracking-widest text-[#FDFBF7] font-bold truncate">{b.service}</p>
                      </td>
                      <td className="px-6 py-6 text-[10px] text-gray-400 whitespace-nowrap">
                        {new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} <span className="text-[#C5A059]/40 mx-1">/</span> {b.time}
                      </td>
                      <td className={`px-6 py-6 text-[9px] uppercase tracking-[0.2em] font-bold ${statusStyle(b.status)}`}>
                        {b.status}
                      </td>
                      <td className="px-6 py-6 text-[11px] text-[#C5A059] font-serif tabular-nums font-bold">${b.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

        {/* ─── Command Links ─── */}
        <div>
          <h2 className="text-[9px] uppercase tracking-[0.4em] text-[#404040] mb-6">Quick Access</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#141414]">
            {[
              { label: 'Booking Calendar', href: '/admin/calendar', desc: 'Visual calendar view of all appointments.' },
              { label: 'Booking Ledger', href: '/admin/bookings', desc: 'Manage, filter and update all appointments.' },
              { label: 'Client Registry', href: '/admin/clients', desc: 'Browse and curate your client database.' },
              { label: 'Services & Media', href: '/admin/services', desc: 'Manage services and upload pictures/videos.' },
              { label: 'Configuration', href: '/admin/settings', desc: 'Update pricing, content and social handles.' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-[#060606] px-8 py-8 flex flex-col justify-between min-h-[120px] hover:bg-[#0C0C0C] transition-all duration-300"
              >
                <span className="text-xs font-serif text-[#FDFBF7] group-hover:text-[#C5A059] transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-[9px] text-[#404040] leading-relaxed mt-3 block">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>

    </div>
  );
}
