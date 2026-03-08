'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ConversationTrigger from '@/components/ui/ConversationTrigger';

const DEFAULT_BENEFITS = ['Tension-free installation', 'Premium extensions', 'Scalp comfort focused', 'Longevity focused'];
const DEFAULT_CARE = ['Sleep with satin scarf', 'Moisturize regularly', 'Avoid over-manipulation'];

export default function ServicesPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/siteSettings')
      .then(res => res.json())
      .then(data => {
        const dbServices = data.settings?.services;
        if (dbServices && dbServices.length > 0) {
          // Map DB structure to page structure
          const mapped = dbServices.map((s: any, i: number) => ({
            id: s.id,
            category: s.category || 'Braiding',
            n: (i + 1).toString().padStart(2, '0'),
            title: s.name,
            tag: i < 3 ? 'Classic' : 'Signature',
            headline: s.description || 'Professional braiding artistry tailored to your crown.',
            description: s.description || 'Professional braiding artistry tailored to your crown.',
            sizes: s.sizes.map((sz: any) => ({
              label: sz.size,
              price: `$${sz.price}`,
              duration: `${sz.duration} min`
            })),
            longevity: s.category === 'Cornrows' ? '3–4 weeks' : '6–10 weeks',
            benefits: DEFAULT_BENEFITS,
            care: DEFAULT_CARE
          }));
          setServices(mapped);
          if (mapped.length > 0) setOpen(mapped[0].id);
        } else {
          setLoading(false);
          // Fallback handled by empty state or seed
        }
      })
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, []);

  // Group services by category
  const groupedServices = useMemo(() => {
    const groups: Record<string, any[]> = {};
    services.forEach(s => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [services]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-[9px] uppercase tracking-widest text-muted animate-pulse">
        Loading Catalog...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-dark text-primary pt-24 lg:pt-32 pb-24">

      {/* ─── Header ──────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-16 border-b border-surface pb-14 text-center md:text-left">
        <span className="text-[9px] uppercase tracking-[0.45em] text-accent block mb-4">Le Menu</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-serif leading-none tracking-tight">
            Our<br className="hidden md:block" /><span className="italic font-light text-accent md:ml-0 ml-2">Services.</span>
          </h1>
          <div className="max-w-sm mx-auto md:mx-0">
            <p className="text-sm text-muted leading-relaxed font-light mb-6">
              Precision braiding for every style. Select a category to explore our comprehensive price list and book your session.
            </p>
            <Link href="/booking"
              className="inline-block text-[9px] uppercase tracking-[0.3em] text-accent border-b border-accent pb-1 hover:text-primary hover:border-accent transition-all">
              Book a Session →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Categorized Catalogue ─────────────────────────────────────── */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto space-y-20">
        {Object.entries(groupedServices).map(([category, svcs]) => (
          <div key={category} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-accent font-semibold">{category}</h2>
              <div className="h-px bg-surface flex-1"></div>
            </div>

            <div className="grid gap-px bg-surface border border-surface">
              {svcs.map((svc) => {
                const isOpen = open === svc.id;
                return (
                  <div key={svc.id} className="bg-dark">
                    {/* ── Accordion Trigger ── */}
                    <button
                      className="w-full text-left px-6 py-6 flex items-center justify-between gap-4 group hover:bg-[#080808] transition-colors"
                      onClick={() => setOpen(isOpen ? null : svc.id)}
                    >
                      <div className="flex items-center gap-6 flex-1 min-w-0">
                        <span className="text-[9px] font-mono text-muted shrink-0">{svc.n}</span>
                        <h3 className={`text-xl md:text-2xl font-serif leading-none transition-colors ${isOpen ? 'text-accent' : 'text-primary group-hover:text-accent'}`}>
                          {svc.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-8 shrink-0">
                        <span className="text-sm text-accent tabular-nums hidden sm:block">
                          {svc.sizes.length > 0 ? `from ${svc.sizes[0].price}` : ''}
                        </span>
                        <span className={`text-lg text-accent transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                      </div>
                    </button>

                    {/* ── Expanded Panel ── */}
                    {isOpen && (
                      <div className="border-t border-surface grid md:grid-cols-[1fr_320px] gap-px bg-surface">
                        {/* Left: Info */}
                        <div className="bg-dark p-6 lg:p-8 space-y-8">
                          <div>
                            <h4 className="text-base font-serif text-accent italic mb-3 leading-snug max-w-xl">
                              &ldquo;{svc.headline}&rdquo;
                            </h4>
                            <p className="text-sm text-muted leading-relaxed max-w-2xl font-light">
                              {svc.description}
                            </p>
                          </div>

                          {/* Benefits */}
                          <div>
                            <p className="text-[8px] uppercase tracking-[0.35em] text-muted mb-4">What&apos;s Included</p>
                            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                              {svc.benefits.map((b: string) => (
                                <div key={b} className="flex items-start gap-3">
                                  <span className="text-accent text-[10px] mt-0.5 shrink-0">—</span>
                                  <span className="text-xs text-muted">{b}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Longevity + Care */}
                          <div className="grid sm:grid-cols-2 gap-8 border-t border-surface pt-6">
                            <div>
                              <p className="text-[8px] uppercase tracking-[0.35em] text-muted mb-3">Wear Life</p>
                              <p className="text-sm text-primary font-serif">{svc.longevity}</p>
                            </div>
                            <div>
                              <p className="text-[8px] uppercase tracking-[0.35em] text-muted mb-3">Care Guide</p>
                              <ul className="space-y-1.5">
                                {svc.care.map((c: string) => (
                                  <li key={c} className="text-[10px] text-muted leading-relaxed">· {c}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <Link
                            href="/booking"
                            className="inline-block text-[9px] uppercase tracking-[0.3em] text-accent border-b border-accent pb-1 hover:text-primary hover:border-accent transition-all"
                          >
                            Book {svc.title} →
                          </Link>
                        </div>

                        {/* Right: Pricing Table */}
                        <div className="bg-[#050505] p-6 lg:p-8">
                          <p className="text-[8px] uppercase tracking-[0.35em] text-muted mb-5">Pricing / Lengths</p>
                          <div className="space-y-px">
                            {svc.sizes.map((sz: any, i: number) => (
                              <div
                                key={sz.label}
                                className={`flex items-center justify-between py-4 px-4 transition-colors ${i === 0 ? 'bg-accent/5 border border-accent/20' : 'bg-dark border border-surface/50'}`}
                              >
                                <div>
                                  <p className="text-xs text-primary">{sz.label}</p>
                                  <p className="text-[9px] text-muted mt-0.5">{sz.duration}</p>
                                </div>
                                <span className={`text-sm tabular-nums ${i === 0 ? 'text-accent' : 'text-primary'}`}>{sz.price}</span>
                              </div>
                            ))}
                          </div>

                          <p className="text-[8px] text-muted mt-4 leading-relaxed italic">
                            All prices are starting rates. Final quote provided at consultation based on hair density.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* ─── Add-Ons ────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto mt-24">
        <div className="border border-surface bg-[#080808] p-8 lg:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[8px] uppercase tracking-[0.4em] text-accent block mb-3">Customizations</span>
              <h2 className="text-3xl font-serif text-primary leading-tight">Elevate Your Style</h2>
              <p className="text-xs text-muted mt-4 max-w-md leading-relaxed">
                Add extra length, volume, or curls to any service. We also offer professional takedown services to prepare your hair for its next evolution.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[7px] uppercase tracking-widest text-muted mb-1">Extra Length</p>
                  <p className="text-sm font-serif text-accent">+$30</p>
                </div>
                <div>
                  <p className="text-[7px] uppercase tracking-widest text-muted mb-1">Extra Fullness</p>
                  <p className="text-sm font-serif text-accent">+$40</p>
                </div>
              </div>
            </div>
            <div className="bg-dark/50 border border-surface p-6 space-y-4">
              <p className="text-[8px] uppercase tracking-widest text-muted">Service Add-ons</p>
              <div className="flex justify-between items-center border-b border-surface/30 pb-3">
                <span className="text-xs text-primary">Takedown Services</span>
                <span className="text-xs text-accent">$70</span>
              </div>
              <div className="flex justify-between items-center border-b border-surface/30 pb-3">
                <span className="text-xs text-primary">Boho Finish</span>
                <span className="text-xs text-accent">+$30</span>
              </div>
              <Link href="/booking" className="block text-center bg-accent text-dark py-3 px-6 text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-accent/90 transition-all mt-4">
                View All Add-ons
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bespoke CTA ─────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto mt-20 border border-surface bg-dark">
        <div className="py-12 lg:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="mx-auto md:mx-0">
            <span className="text-[8px] uppercase tracking-[0.4em] text-accent block mb-3">Bespoke Services</span>
            <h2 className="text-3xl font-serif text-primary leading-tight max-w-md mx-auto md:mx-0">
              Looking for something truly unique?
            </h2>
            <p className="text-xs text-muted mt-4 max-w-md leading-relaxed mx-auto md:mx-0">
              We welcome custom requests for editorial shoots, weddings, and special events. Our master artisans will design specifically for you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 justify-center">
            <Link href="/contact"
              className="border border-surface text-muted hover:border-accent hover:text-accent py-3 px-6 text-[9px] uppercase tracking-[0.3em] transition-all text-center">
              Request Quote
            </Link>
            <Link href="/booking"
              className="bg-accent text-dark hover:bg-accent/80 py-3 px-6 text-[9px] uppercase tracking-[0.3em] font-semibold transition-all text-center">
              Book Now
            </Link>
          </div>
        </div>
      </section>

      <ConversationTrigger
        position="bottom-right"
        style="bubble"
        message="Find your perfect style. Book a consultation with our specialists."
        buttonText="Reserve Now"
      />
    </main>
  );
}
