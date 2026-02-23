import Link from 'next/link';

interface ServicesSectionProps {
  services?: any[];
}

const DEFAULT_SERVICES = [
  {
    id: '01',
    title: 'Box Braids',
    tag: 'Most Requested',
    description: 'Precision-parted, tension-free structural braids with premium extensions. The definitive protective style.',
    price: 'From $150',
    duration: '3–5 hrs',
    sizes: ['Small · $250', 'Medium · $200', 'Large · $150'],
    longevity: '6–8 weeks',
    benefits: ['Protective & low maintenance', 'Works for all hair types', 'Promotes healthy growth'],
  },
  {
    id: '02',
    title: 'Knotless Braids',
    tag: 'Signature',
    description: 'Seamless roots, invisible finish, zero tension. A pain-free elevation of the classic braid.',
    price: 'From $200',
    duration: '4–7 hrs',
    sizes: ['Small · $300', 'Medium · $250', 'Large · $200'],
    longevity: '6–10 weeks',
    benefits: ['No bulge at root', 'Lighter weight', 'Natural look from crown'],
  },
  {
    id: '03',
    title: 'Signature Cornrows',
    tag: 'Editorial',
    description: 'Architectural straight-backs to intricate custom patterns. Sculpted to complement your crown.',
    price: 'From $80',
    duration: '1.5–4 hrs',
    sizes: ['Small / Detailed · $180', 'Medium / Standard · $120', 'Large / Feed-ins · $80'],
    longevity: '3–4 weeks',
    benefits: ['Fast install', 'Precision parting', 'Great under wigs'],
  },
];

export default function ServicesSection({ services: propServices }: ServicesSectionProps) {
  // Map DB services to the UI format if needed
  const displayServices = propServices && propServices.length > 0 ? propServices.map((s, i) => ({
    id: `0${i + 1}`,
    title: s.name,
    tag: i === 0 ? 'Most Requested' : i === 1 ? 'Signature' : 'Editorial',
    description: s.description || 'Professional braiding artistry tailored to your crown.',
    price: s.sizes?.length > 0 ? `From $${Math.min(...s.sizes.map((sz: any) => sz.price))}` : 'Contact Us',
    duration: s.sizes?.length > 0 ? `${Math.min(...s.sizes.map((sz: any) => sz.duration))} min+` : 'Varies',
  })) : DEFAULT_SERVICES;

  return (
    <section className="bg-[#080808] border-t border-[#141414] py-20 lg:py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-[#141414] pb-10 text-center md:text-left">
          <div className="mx-auto md:mx-0">
            <span className="text-[9px] uppercase tracking-[0.45em] text-[#C5A059] block mb-4">Le Menu</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#FDFBF7] leading-none tracking-tight">
              Our<br className="hidden md:block" />
              <span className="italic font-light text-[#C5A059] md:ml-0 ml-2">Services.</span>
            </h2>
          </div>
          <div className="max-w-sm mx-auto md:mx-0">
            <p className="text-sm text-[#C8C0B0] leading-relaxed font-light">
              We elevate traditional hair artistry into a considered, sensory experience. Every client receives the full attention of our master craftsmen.
            </p>
            <Link
              href="/booking"
              className="inline-block mt-6 text-[9px] uppercase tracking-[0.3em] text-[#C5A059] border-b border-[#C5A059]/40 pb-1 hover:text-[#FDFBF7] hover:border-[#FDFBF7]/40 transition-all"
            >
              Reserve a Session →
            </Link>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#141414]">
          {displayServices.map((s) => (
            <div key={s.id} className="group bg-[#080808] hover:bg-[#0C0C0C] transition-colors duration-300 p-8 flex flex-col">

              {/* Top row */}
              <div className="flex items-start justify-between mb-6">
                <span className="text-[8px] font-mono text-[#404040]">{s.id}</span>
                <span className="text-[7px] uppercase tracking-[0.25em] text-[#C5A059] border border-[#C5A059]/25 px-2 py-0.5">
                  {s.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-serif text-[#FDFBF7] group-hover:text-[#C5A059] transition-colors duration-300 mb-3 leading-tight">
                {s.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#8A8070] leading-relaxed mb-6 flex-1">
                {s.description}
              </p>

              {/* Price / Duration strip */}
              <div className="flex items-center justify-between border-t border-[#141414] pt-4 mt-auto">
                <span className="text-sm text-[#C5A059] tabular-nums">{s.price}</span>
                <span className="text-[9px] uppercase tracking-widest text-[#5A5248]">{s.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA footer */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#141414] pt-10 text-center sm:text-left">
          <p className="text-xs text-[#8A8070] max-w-sm leading-relaxed mx-auto sm:mx-0">
            Can&apos;t find your style? We accommodate bespoke requests. Consult our team for a custom quote.
          </p>
          <div className="flex gap-6 justify-center sm:justify-end">
            <Link href="/contact"
              className="text-[9px] uppercase tracking-[0.3em] text-[#8A8070] border-b border-[#333]/60 pb-1 hover:text-[#C5A059] hover:border-[#C5A059]/40 transition-all">
              Request Custom
            </Link>
            <Link href="/booking"
              className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] border-b border-[#C5A059]/40 pb-1 hover:text-[#FDFBF7] transition-all">
              Book Now →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

