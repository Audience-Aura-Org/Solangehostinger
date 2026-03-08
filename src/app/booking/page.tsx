'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';

type ServiceSize = { id: string; name: string; price: number; duration: number };
type StyleCategory = { id: string; name: string; category: string; description: string; tag: string; sizes: ServiceSize[] };
type Addon = { _id: string; name: string; description: string; price: number; duration: number; linkedCategories: string[]; linkedSizes: string[] };

const FALLBACK_SERVICES: StyleCategory[] = [
  // 1. Knotless Braids
  {
    id: 'extra-small-knotless', name: 'Extra Small Knotless', category: 'Knotless Braids', tag: 'Elite',
    description: 'Ultra-fine, long-lasting protective style with minimal tension.',
    sizes: [
      { id: 'xs-shoulder', name: 'Shoulder Length', price: 320, duration: 420 },
      { id: 'xs-mid-back', name: 'Mid Back', price: 350, duration: 480 },
      { id: 'xs-waist', name: 'Waist Length', price: 380, duration: 540 },
      { id: 'xs-hip', name: 'Hip Length', price: 420, duration: 600 },
      { id: 'xs-thigh', name: 'Thigh Length', price: 450, duration: 660 },
    ],
  },
  {
    id: 'small-knotless', name: 'Small Knotless', category: 'Knotless Braids', tag: 'Classic',
    description: 'Classic small knotless braids for a seamless, natural look.',
    sizes: [
      { id: 's-bob', name: 'Bob Length', price: 250, duration: 300 },
      { id: 's-shoulder', name: 'Shoulder Length', price: 250, duration: 300 },
      { id: 's-mid-back', name: 'Mid Back', price: 300, duration: 360 },
      { id: 's-waist', name: 'Waist Length', price: 300, duration: 360 },
      { id: 's-hip', name: 'Hip Length', price: 350, duration: 420 },
      { id: 's-thigh', name: 'Thigh Length', price: 400, duration: 480 },
    ],
  },
  {
    id: 'medium-knotless', name: 'Medium Knotless', category: 'Knotless Braids', tag: 'Versatile',
    description: 'Versatile medium-sized braids for everyday elegance.',
    sizes: [
      { id: 'm-bob', name: 'Bob Length', price: 150, duration: 180 },
      { id: 'm-shoulder', name: 'Shoulder Length', price: 150, duration: 180 },
      { id: 'm-mid-back', name: 'Mid Back', price: 180, duration: 240 },
      { id: 'm-waist', name: 'Waist Length', price: 180, duration: 240 },
      { id: 'm-hip', name: 'Hip Length', price: 220, duration: 300 },
      { id: 'm-thigh', name: 'Thigh Length', price: 250, duration: 360 },
    ],
  },
  {
    id: 'large-knotless', name: 'Large Knotless', category: 'Knotless Braids', tag: 'Bold',
    description: 'Bold, beautiful, and faster to install.',
    sizes: [
      { id: 'l-bob', name: 'Bob Length', price: 150, duration: 150 },
      { id: 'l-shoulder', name: 'Shoulder Length', price: 150, duration: 150 },
      { id: 'l-mid-back', name: 'Mid Back', price: 170, duration: 180 },
      { id: 'l-waist', name: 'Waist Length', price: 170, duration: 180 },
      { id: 'l-hip', name: 'Hip Length', price: 200, duration: 240 },
      { id: 'l-thigh', name: 'Thigh Length', price: 230, duration: 300 },
    ],
  },
  {
    id: 'jumbo-knotless', name: 'Jumbo Knotless', category: 'Knotless Braids', tag: 'Statement',
    description: 'Extreme volume and quick installation for a dramatic statement.',
    sizes: [
      { id: 'j-mid-back', name: 'Mid Back', price: 150, duration: 120 },
      { id: 'j-waist', name: 'Waist Length', price: 150, duration: 120 },
      { id: 'j-hip', name: 'Hip Length', price: 180, duration: 180 },
    ],
  },
  // 2. Boho / Goddess Braids
  {
    id: 'boho-knotless', name: 'Boho Knotless', category: 'Boho / Goddess Braids', tag: 'Artistic',
    description: 'Beautiful knotless braids with loose curly strands throughout.',
    sizes: [
      { id: 'boho-s-shoulder', name: 'Small Shoulder', price: 250, duration: 300 },
      { id: 'boho-s-mid', name: 'Small Mid Back', price: 300, duration: 360 },
      { id: 'boho-s-waist', name: 'Small Waist', price: 330, duration: 420 },
      { id: 'boho-m-shoulder', name: 'Medium Shoulder', price: 180, duration: 240 },
      { id: 'boho-m-waist', name: 'Medium Waist', price: 250, duration: 300 },
    ],
  },
  {
    id: 'goddess-box-braids', name: 'Goddess Box Braids', category: 'Boho / Goddess Braids', tag: 'Traditional',
    description: 'Classic box braids with curly ends or loose strands.',
    sizes: [
      { id: 'gbb-s-shoulder', name: 'Small Shoulder', price: 250, duration: 300 },
      { id: 'gbb-s-waist', name: 'Small Waist', price: 300, duration: 360 },
    ],
  },
  // 3. Cornrows
  {
    id: 'straight-back-cornrows', name: 'Straight Back Cornrows', category: 'Cornrows', tag: 'Sleek',
    description: 'Classic uniform cornrows for a clean and sleek look.',
    sizes: [
      { id: 'sb-2', name: '2 Braids', price: 50, duration: 45 },
      { id: 'sb-4', name: '4 Braids', price: 50, duration: 60 },
      { id: 'sb-6', name: '6 Braids', price: 70, duration: 90 },
      { id: 'sb-8', name: '8 Braids', price: 90, duration: 120 },
      { id: 'sb-10', name: '10 Braids', price: 100, duration: 150 },
      { id: 'sb-12', name: '12 Braids', price: 120, duration: 180 },
    ],
  },
  {
    id: 'feed-in-cornrows', name: 'Feed-In Cornrows', category: 'Cornrows', tag: 'Natural',
    description: 'Cornrows where extensions are added gradually for a more natural root.',
    sizes: [
      { id: 'fi-2', name: '2 Feed-In', price: 40, duration: 60 },
      { id: 'fi-4', name: '4 Feed-In', price: 40, duration: 90 },
      { id: 'fi-6', name: '6 Feed-In', price: 70, duration: 120 },
      { id: 'fi-8', name: '8 Feed-In', price: 90, duration: 150 },
      { id: 'fi-10', name: '10 Feed-In', price: 110, duration: 180 },
    ],
  },
  {
    id: 'stitch-braids', name: 'Stitch Braids', category: 'Cornrows', tag: 'Textured',
    description: 'Textured cornrows with horizontal lines (stitches) for extra detail.',
    sizes: [
      { id: 'st-2', name: '2 Stitch', price: 60, duration: 75 },
      { id: 'st-4', name: '4 Stitch', price: 60, duration: 100 },
      { id: 'st-6', name: '6 Stitch', price: 90, duration: 140 },
      { id: 'st-8', name: '8 Stitch', price: 120, duration: 180 },
    ],
  },
  {
    id: 'tribal-fulani-braids', name: 'Tribal / Fulani Braids', category: 'Cornrows', tag: 'Cultural',
    description: 'Intricate patterns with extensions, symbolic of the Fulani people.',
    sizes: [
      { id: 'tf-shoulder', name: 'Shoulder Length', price: 200, duration: 180 },
      { id: 'tf-mid-back', name: 'Mid Back', price: 220, duration: 240 },
      { id: 'tf-waist', name: 'Waist Length', price: 250, duration: 300 },
    ],
  },
  {
    id: 'lemonade-braids', name: 'Lemonade Braids', category: 'Cornrows', tag: 'Famous',
    description: 'Long-side-swept cornrows famous for their signature silhouette.',
    sizes: [
      { id: 'lb-shoulder', name: 'Shoulder', price: 150, duration: 150 },
      { id: 'lb-mid-back', name: 'Mid Back', price: 180, duration: 210 },
      { id: 'lb-waist', name: 'Waist', price: 200, duration: 240 },
    ],
  },
  // 4. Twists
  {
    id: 'senegalese-twists', name: 'Senegalese Twists', category: 'Twists', tag: 'Smooth',
    description: 'Smooth, uniform two-strand twists for an elegant look.',
    sizes: [
      { id: 'sen-s-shoulder', name: 'Small Shoulder', price: 250, duration: 300 },
      { id: 'sen-s-waist', name: 'Small Waist', price: 300, duration: 360 },
      { id: 'sen-m-shoulder', name: 'Medium Shoulder', price: 200, duration: 240 },
      { id: 'sen-m-waist', name: 'Medium Waist', price: 250, duration: 300 },
    ],
  },
  // 5. Kids Services
  {
    id: 'kids-knotless', name: 'Kids Knotless', category: 'Kids Services', tag: 'Gentle',
    description: 'Tension-free knotless braids scaled for children.',
    sizes: [
      { id: 'kids-k-mid', name: 'Mid Back', price: 150, duration: 180 },
    ],
  },
  {
    id: 'kids-box-braids', name: 'Kids Box Braids', category: 'Kids Services', tag: 'Protective',
    description: 'Classic box braids scaled for children.',
    sizes: [
      { id: 'kids-bb-mid', name: 'Mid Back', price: 150, duration: 150 },
    ],
  },
  {
    id: 'kids-cornrows', name: 'Kids Cornrows', category: 'Kids Services', tag: 'Fast',
    description: 'Simple and protective children\'s cornrows.',
    sizes: [
      { id: 'kids-cr-4', name: '4 Braids', price: 40, duration: 60 },
      { id: 'kids-cr-6', name: '6 Braids', price: 50, duration: 90 },
      { id: 'kids-cr-8', name: '8 Braids', price: 70, duration: 120 },
    ],
  },
];

const AVAILABLE_TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:30 PM', '4:30 PM'];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type Step = 'mainCategory' | 'style' | 'size' | 'addons' | 'datetime' | 'info' | 'confirmation';

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function getDays() {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) days.push(d); // skip Sundays
  }
  return days;
}

const STEPS: Record<Step, { n: string; label: string }> = {
  mainCategory: { n: '01', label: 'Service Type' },
  style: { n: '02', label: 'Select Style' },
  size: { n: '03', label: 'Select Size' },
  addons: { n: '04', label: 'Add Extra' },
  datetime: { n: '05', label: 'Date & Time' },
  info: { n: '06', label: 'Your Details' },
  confirmation: { n: '07', label: 'Confirmed' },
};

export default function BookingPage() {
  const [step, setStep] = useState<Step>('mainCategory');
  const [categories, setCategories] = useState<StyleCategory[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StyleCategory | null>(null);
  const [selectedSize, setSelectedSize] = useState<ServiceSize | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', email: '', hairColor: '' });

  // load saved client info from previous booking
  useEffect(() => {
    try {
      const stored = localStorage.getItem('solangeClientInfo');
      if (stored) setFormData(JSON.parse(stored));
    } catch { }
  }, []);

  // persist changes so returning users don't have to retype
  useEffect(() => {
    try {
      localStorage.setItem('solangeClientInfo', JSON.stringify(formData));
    } catch { }
  }, [formData]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/siteSettings').then(r => r.json()),
      fetch('/api/admin/addons').then(r => r.json())
    ])
      .then(([settingsData, addonsData]) => {
        const dbServices = settingsData.settings?.services;
        if (dbServices && dbServices.length > 0) {
          setCategories(dbServices.map((s: any) => ({
            id: s.id,
            name: s.name,
            category: s.category || 'Braiding',
            description: s.description,
            tag: 'Classic',
            sizes: s.sizes.map((sz: any) => ({
              id: sz.id,
              name: sz.size,
              price: sz.price,
              duration: sz.duration
            }))
          })));
        } else {
          setCategories(FALLBACK_SERVICES);
        }
        setAddons(addonsData.addons || []);
      })
      .catch(() => {
        setCategories(FALLBACK_SERVICES);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalAddonPrice = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const totalPrice = (selectedSize?.price || 0) + totalAddonPrice;
  const totalDuration = (selectedSize?.duration || 0) + selectedAddons.reduce((acc, a) => acc + a.duration, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSize || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: `${formData.firstName} ${formData.lastName}`.trim(),
          clientEmail: formData.email,
          clientPhone: formData.phone,
          service: `${selectedCategory.name} — ${selectedSize.name}`,
          serviceId: selectedSize.id,
          addons: selectedAddons.map(a => ({ id: a._id, name: a.name, price: a.price })),
          date: selectedDate.toISOString(),
          time: selectedTime,
          duration: totalDuration,
          price: totalPrice,
          hairColor: formData.hairColor,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setConfirmationNumber(data.confirmationNumber || '');

      // Redirect to Stripe checkout
      const stripeRes = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: data.booking._id,
          price: 30, // Charging the $30 deposit
          clientEmail: formData.email,
          serviceName: `${selectedCategory.name} (${selectedSize.name})`,
        }),
      });
      const stripeData = await stripeRes.json();
      if (stripeData.url) {
        window.location.href = stripeData.url;
      } else {
        setStep('confirmation');
      }
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadTicket = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('serif', 'bold');
    doc.setFontSize(24);
    doc.text('SOLANGE', 105, 20, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(197, 160, 89);
    doc.text('SIGNATURE HAIR — LA MAISON DE BEAUTÉ', 105, 30, { align: 'center' });

    // Details Block
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('OFFICIAL RESERVATION TICKET', 20, 55);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 58, 190, 58);

    doc.setFontSize(9);
    doc.text(`REFERENCE: ${confirmationNumber}`, 20, 70);
    doc.text(`CLIENT: ${formData.firstName} ${formData.lastName}`, 20, 80);
    doc.text(`SERVICE: ${selectedCategory?.name} (${selectedSize?.name})`, 20, 90);
    doc.text(`DATE: ${selectedDate?.toLocaleDateString()} at ${selectedTime}`, 20, 100);
    doc.text(`TOTAL INVESTMENT: $${totalPrice}`, 20, 110);
    doc.text(`HAIR COLOR: ${formData.hairColor || 'No specific selection'}`, 20, 120);

    // Extras
    if (selectedAddons.length > 0) {
      doc.text('EXTRAS INCLUDED:', 20, 135);
      selectedAddons.forEach((a, i) => {
        doc.text(`• ${a.name}`, 25, 142 + (i * 5));
      });
    }

    // Studio Info
    const startY = selectedAddons.length > 0 ? 160 + (selectedAddons.length * 5) : 140;
    doc.setFillColor(250, 250, 250);
    doc.rect(20, startY, 170, 40, 'F');
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.text('LA MAISON LOCATION:', 30, startY + 10);
    doc.setFontSize(8);
    doc.text('6495 New Hampshire Ave, Hyattsville, MD', 30, startY + 18);
    doc.text('Contact: +1 301 454 9435', 30, startY + 24);
    doc.text('Email: Experience@solange.hair', 30, startY + 30);

    // Policies
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('* $30 deposit is required to secure session. Non-refundable.', 20, 280);
    doc.text('* Any complaints must be reported within 3 days maximum.', 20, 285);

    doc.save(`Solange-Ticket-${confirmationNumber}.pdf`);
  };

  const handleMainCategorySelect = (mainCat: string) => {
    setSelectedMainCategory(mainCat);
    setStep('style');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat: StyleCategory) => {
    setSelectedCategory(cat);
    if (cat.sizes.length === 1) {
      setSelectedSize(cat.sizes[0]);
      setStep('addons');
    }
    else { setSelectedSize(null); setStep('size'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mainCategories = useMemo(() => {
    const cats = new Set<string>();
    categories.forEach(s => cats.add(s.category || 'Braiding'));
    return Array.from(cats);
  }, [categories]);

  const stylesInSelectedCategory = useMemo(() => {
    if (!selectedMainCategory) return [];
    return categories.filter(s => s.category === selectedMainCategory);
  }, [categories, selectedMainCategory]);

  const handleSizeSelect = (size: ServiceSize) => {
    setSelectedSize(size);
    setStep('addons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a._id === addon._id)
        ? prev.filter(a => a._id !== addon._id)
        : [...prev, addon]
    );
  };

  const availableAddons = addons.filter(a => {
    if (!selectedCategory || !selectedSize) return false;
    // If no specific links are defined, show to all
    if (a.linkedCategories.length === 0 && a.linkedSizes.length === 0) return true;
    return a.linkedCategories.includes(selectedCategory.id) || a.linkedSizes.includes(selectedSize.id);
  });

  const days = getDays();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-[9px] uppercase tracking-widest text-[#404040] animate-pulse font-serif">
        Opening Ledger...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#FDFBF7] font-sans pt-24 lg:pt-32 pb-20">
      <div className="max-w-[1100px] mx-auto px-5 lg:px-10">

        {/* ─── Page Title ─── */}
        <div className="mb-12 border-b border-[#141414] pb-8">
          <span className="text-[9px] uppercase tracking-[0.45em] text-[#C5A059] block mb-3">Concierge Booking</span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight leading-none">
            Reserve <span className="italic font-light text-[#C5A059]">a Session.</span>
          </h1>
        </div>

        {/* ─── Step Indicator ─── */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
          {(Object.entries(STEPS) as [Step, { n: string; label: string }][]).map(([key, val], i, arr) => {
            const isDone = Object.keys(STEPS).indexOf(step) > i;
            const isActive = key === step;
            return (
              <div key={key} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${isActive ? 'opacity-100' : isDone ? 'opacity-60' : 'opacity-20'}`}>
                  <span className={`text-[8px] font-mono tabular-nums ${isActive ? 'text-[#C5A059]' : 'text-[#FDFBF7]'}`}>{val.n}</span>
                  <span className={`text-[9px] uppercase tracking-[0.2em] hidden sm:block ${isActive ? 'text-[#C5A059]' : 'text-[#FDFBF7]'}`}>{val.label}</span>
                </div>
                {i < arr.length - 1 && <span className="text-[#222] text-[10px]">—</span>}
              </div>
            );
          })}
        </div>

        {/* ─── Main Grid ─── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start w-full max-w-full overflow-hidden">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-32 max-w-full">

            {/* Brand mark */}
            <div className="border border-[#141414] p-6 mb-6 flex flex-col items-center text-center">
              <span className="text-5xl font-serif text-[#C5A059] opacity-30 block mb-2">S.</span>
              <span className="text-base font-serif text-[#FDFBF7]">Solange</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8A8070] mt-1">La Maison de Beauté</span>
            </div>

            {/* Appointment Summary */}
            <div className="border border-[#141414] bg-[#060606] p-5 space-y-4">
              <span className="text-[8px] uppercase tracking-[0.35em] text-[#C5A059] block">Itinerary</span>

              {selectedCategory ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-serif text-[#FDFBF7]">{selectedCategory.name}</p>
                    {selectedSize ? (
                      <div className="flex justify-between items-baseline mt-2 border-b border-[#141414] pb-3">
                        <span className="text-[9px] uppercase tracking-widest text-[#C8C0B0]">{selectedSize.name} · {formatDuration(selectedSize.duration)}</span>
                        <span className="text-sm text-[#C5A059] tabular-nums">${selectedSize.price}</span>
                      </div>
                    ) : (
                      <p className="text-[9px] text-[#5A5248] mt-1 italic">Awaiting size selection</p>
                    )}
                  </div>

                  {selectedAddons.length > 0 && (
                    <div className="space-y-1 border-b border-[#141414] pb-3">
                      {selectedAddons.map(a => (
                        <div key={a._id} className="flex justify-between text-[9px] uppercase tracking-widest">
                          <span className="text-[#8A8070]">{a.name}</span>
                          <span className="text-[#C5A059]">+${a.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedDate ? (
                    <div className="pt-1">
                      <p className="text-xs text-[#FDFBF7]">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-[9px] text-[#C5A059] uppercase tracking-widest mt-0.5">{selectedTime || 'Awaiting time'}</p>
                    </div>
                  ) : (
                    <p className="text-[9px] text-[#5A5248] italic">Awaiting schedule</p>
                  )}

                  {selectedSize && (
                    <div className="pt-2 flex justify-between items-center border-t border-[#141414]">
                      <span className="text-[8px] uppercase tracking-widest text-[#404040]">Investment</span>
                      <span className="text-base font-serif text-[#FDFBF7]">${totalPrice}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[9px] text-[#5A5248] italic">No selection yet</p>
              )}
            </div>

            {/* Policy note */}
            <p className="text-[9px] text-[#5A5248] leading-relaxed mt-4 px-1">
              By appointment only. 24-hour cancellation policy applies. A confirmation will be dispatched upon booking.
            </p>
          </aside>

          {/* Main Wizard Content */}
          <div className="flex-1 w-full min-h-[480px]">

            {/* ── Step 1: Choose Main Category ── */}
            {step === 'mainCategory' && (
              <div className="w-full">
                <p className="text-[9px] uppercase tracking-[0.35em] text-[#8A8070] mb-6">Choose service category</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {mainCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleMainCategorySelect(cat)}
                      className="group border border-[#141414] bg-[#060606] hover:border-[#C5A059]/40 hover:bg-[#080808] transition-all p-8 text-center flex flex-col items-center gap-4"
                    >
                      <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] opacity-40 group-hover:opacity-100 transition-opacity">◇</span>
                      <h3 className="font-serif text-[#FDFBF7] text-lg group-hover:text-[#C5A059] transition-colors">{cat}</h3>
                      <p className="text-[9px] uppercase tracking-widest text-[#404040] group-hover:text-[#8A8070]">Explore styles</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Choose Specific Style ── */}
            {step === 'style' && selectedMainCategory && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => { setStep('mainCategory'); setSelectedMainCategory(null); }}
                    className="text-[9px] uppercase tracking-widest text-[#8A8070] hover:text-[#C5A059] transition-colors font-semibold">
                    ← Categories
                  </button>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#8A8070]">{selectedMainCategory}</p>
                </div>

                <div className="space-y-3">
                  {stylesInSelectedCategory.map((cat: StyleCategory) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat)}
                      className="w-full group border border-[#141414] bg-[#060606] hover:border-[#C5A059]/40 hover:bg-[#080808] transition-all p-5 text-left flex items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-serif text-[#FDFBF7] text-base group-hover:text-[#C5A059] transition-colors">{cat.name}</h3>
                          {cat.tag && <span className="text-[7px] uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/30 px-2 py-0.5">{cat.tag}</span>}
                        </div>
                        <p className="text-xs text-[#8A8070] leading-relaxed">{cat.description}</p>
                        <p className="text-[9px] text-[#C5A059] mt-2 uppercase tracking-widest">
                          From ${cat.sizes.length > 0 ? Math.min(...cat.sizes.map((s: ServiceSize) => s.price)) : 0}
                        </p>
                      </div>
                      <span className="text-[#404040] group-hover:text-[#C5A059] text-lg transition-colors shrink-0">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Choose Size ── */}
            {step === 'size' && selectedCategory && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => { setStep('style'); setSelectedCategory(null); }}
                    className="text-[9px] uppercase tracking-widest text-[#8A8070] hover:text-[#C5A059] transition-colors">
                    ← Styles
                  </button>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#8A8070]">Select variation</p>
                </div>
                <p className="text-sm font-serif text-[#FDFBF7] mb-6 border-b border-[#141414] pb-4">{selectedCategory.name}</p>
                <div className="space-y-2">
                  {selectedCategory.sizes.map(size => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeSelect(size)}
                      className="w-full group border border-[#141414] bg-[#060606] hover:border-[#C5A059]/40 transition-all p-5 flex items-center justify-between text-left"
                    >
                      <div>
                        <p className="text-sm font-serif text-[#FDFBF7] group-hover:text-[#C5A059] transition-colors mb-1">{size.name}</p>
                        <p className="text-[9px] uppercase tracking-widest text-[#8A8070]">{formatDuration(size.duration)} session</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-serif text-[#C5A059]">${size.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3: Addons ── */}
            {step === 'addons' && selectedCategory && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => { setStep('size'); setSelectedAddons([]); }}
                    className="text-[9px] uppercase tracking-widest text-[#8A8070] hover:text-[#C5A059] transition-colors">
                    ← Variation
                  </button>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#8A8070]">Enhance your style</p>
                </div>

                <div className="space-y-3">
                  {availableAddons.length > 0 ? (
                    availableAddons.map(a => {
                      const isSelected = selectedAddons.find(x => x._id === a._id);
                      return (
                        <button
                          key={a._id}
                          onClick={() => toggleAddon(a)}
                          className={`w-full group border p-5 flex items-center justify-between transition-all ${isSelected ? 'border-accent bg-accent/10' : 'border-surface bg-dark hover:border-surface'}`}
                        >
                          <div className="text-left flex-1">
                            <p className={`text-sm font-serif ${isSelected ? 'text-accent' : 'text-primary'}`}>{a.name}</p>
                            <p className="text-[10px] text-muted leading-relaxed mt-1">{a.description}</p>
                            <p className="text-[8px] uppercase tracking-widest text-faint mt-2">+{a.duration} mins duration</p>
                          </div>
                          <div className="text-right ml-6">
                            <span className={`text-sm font-serif ${isSelected ? 'text-accent' : 'text-muted'}`}>+${a.price}</span>
                            <div className={`w-4 h-4 border mx-auto mt-3 flex items-center justify-center transition-colors ${isSelected ? 'border-accent bg-accent' : 'border-surface'}`}>
                              {isSelected && <span className="text-[8px] text-dark">✓</span>}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 border border-dashed border-[#141414]">
                      <p className="text-[10px] uppercase tracking-widest text-muted">No extras available for this selection</p>
                    </div>
                  )}

                  <button
                    onClick={() => setStep('datetime')}
                    className="w-full mt-6 bg-[#C5A059] text-[#080808] py-4 text-[9px] uppercase tracking-[0.35em] hover:bg-[#DFBE82] transition-colors font-semibold shadow-xl"
                  >
                    Continue to Schedule →
                  </button>
                  <button
                    onClick={() => { setSelectedAddons([]); setStep('datetime'); }}
                    className="w-full py-2 text-[8px] uppercase tracking-[0.2em] text-[#404040] hover:text-[#8A8070] transition-colors"
                  >
                    Skip addons
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Date & Time ── */}
            {step === 'datetime' && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => { setStep('addons'); setSelectedDate(null); setSelectedTime(''); }}
                    className="text-[9px] uppercase tracking-widest text-[#8A8070] hover:text-[#C5A059] transition-colors">
                    ← Addon
                  </button>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#8A8070]">Pick a date & time</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 w-full max-w-full">
                  {/* Calendar */}
                  <div className="border border-[#141414] bg-[#060606] p-4 sm:p-5 overflow-hidden w-full max-w-full">
                    <div className="grid grid-cols-7 gap-1 text-center mb-3 w-full">
                      {DAY_LABELS.map(d => (
                        <div key={d} className="text-[8px] uppercase tracking-widest text-[#C5A059] pb-2 border-b border-[#141414] truncate">{d}</div>
                      ))}
                    </div>
                    {/* Offset placeholder for correct starting day */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 w-full">
                      {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => (
                        <div key={i} />
                      ))}
                      {days.map((date, i) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const isToday = new Date().toDateString() === date.toDateString();
                        return (
                          <button key={i} onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                            className={`aspect-square flex items-center justify-center text-xs transition-all ${isSelected
                              ? 'bg-[#C5A059] text-[#080808] font-semibold'
                              : isToday
                                ? 'border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10'
                                : 'text-[#C8C0B0] hover:text-[#FDFBF7] hover:bg-white/5'
                              }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="border border-[#141414] bg-[#060606] p-5">
                    {selectedDate ? (
                      <>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="space-y-2">
                          {AVAILABLE_TIMES.map(time => (
                            <button key={time} onClick={() => setSelectedTime(time)}
                              className={`w-full py-3 text-[10px] tracking-widest uppercase transition-all border ${selectedTime === time
                                ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]'
                                : 'border-[#1A1A1A] text-[#C8C0B0] hover:border-[#333] hover:text-[#FDFBF7]'
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        {selectedTime && (
                          <button onClick={() => setStep('info')}
                            className="mt-5 w-full bg-[#C5A059] text-[#080808] py-3 text-[9px] uppercase tracking-[0.3em] hover:bg-[#DFBE82] transition-colors font-semibold">
                            Continue →
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-3 text-center">
                        <span className="text-2xl font-serif text-[#1A1A1A]">◇</span>
                        <p className="text-[9px] uppercase tracking-widest text-[#5A5248]">Select a date first</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Client Details ── */}
            {step === 'info' && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setStep('datetime')}
                    className="text-[9px] uppercase tracking-widest text-[#8A8070] hover:text-[#C5A059] transition-colors">
                    ← Calendar
                  </button>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#8A8070]">Your details</p>
                </div>

                <div className="border border-[#141414] bg-[#060606] p-6 lg:p-8">
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        { label: 'First Name', key: 'firstName', type: 'text' },
                        { label: 'Last Name', key: 'lastName', type: 'text' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-[8px] uppercase tracking-[0.25em] text-[#8A8070] mb-2">{f.label}</label>
                          <input
                            type={f.type} required
                            value={formData[f.key as keyof typeof formData]}
                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                            className="w-full bg-transparent border-b border-[#222] py-2.5 text-sm text-[#FDFBF7] focus:border-[#C5A059] focus:outline-none transition-colors"
                          />
                        </div>
                      ))}
                    </div>

                    {[
                      { label: 'Phone Number', key: 'phone', type: 'tel' },
                      { label: 'Email Address', key: 'email', type: 'email' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-[8px] uppercase tracking-[0.25em] text-[#8A8070] mb-2">{f.label}</label>
                        <input
                          type={f.type} required
                          value={formData[f.key as keyof typeof formData]}
                          onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                          className="w-full bg-transparent border-b border-[#222] py-2.5 text-sm text-[#FDFBF7] focus:border-[#C5A059] focus:outline-none transition-colors"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-[8px] uppercase tracking-[0.25em] text-[#8A8070] mb-2">Preferred Hair Color(s)</label>
                      <input
                        type="text"
                        value={formData.hairColor}
                        onChange={e => setFormData({ ...formData, hairColor: e.target.value })}
                        placeholder="e.g., Jet Black #1, Honey Blonde #27..."
                        className="w-full bg-transparent border-b border-[#222] py-2.5 text-sm text-[#FDFBF7] focus:border-[#C5A059] focus:outline-none transition-colors"
                      />
                      <p className="text-[9px] text-[#5A5248] mt-2 italic">Specify multiple colors if needed for custom blends.</p>
                    </div>

                    {/* Order summary before submit */}
                    {selectedSize && selectedDate && (
                      <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 space-y-2">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-[#C5A059] mb-3">Booking Summary</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#C8C0B0]">{selectedCategory?.name}</span>
                          <span className="text-[#FDFBF7]">{selectedSize.name}</span>
                        </div>

                        {selectedAddons.length > 0 && (
                          <div className="pt-1">
                            {selectedAddons.map(a => (
                              <div key={a._id} className="flex justify-between text-[10px] text-[#8A8070]">
                                <span>+ {a.name}</span>
                                <span>${a.price}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between text-xs pt-1">
                          <span className="text-[#C8C0B0]">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          <span className="text-[#FDFBF7]">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between text-xs border-t border-[#1A1A1A] pt-2 mt-2">
                          <span className="text-[#C8C0B0]">Total Investment</span>
                          <span className="text-[#C5A059] font-serif text-base">${totalPrice}</span>
                        </div>
                      </div>
                    )}

                    {submitError && (
                      <p className="text-xs text-red-400 border border-red-500/20 bg-red-500/5 px-4 py-3">
                        {submitError}
                      </p>
                    )}

                    <button type="submit" disabled={submitting}
                      className="w-full bg-[#C5A059] text-[#080808] py-4 text-[9px] uppercase tracking-[0.35em] hover:bg-[#DFBE82] transition-colors font-semibold disabled:opacity-60 disabled:cursor-wait">
                      {submitting ? 'Securing Reservation...' : 'Finalize Reservation'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── Step 5: Confirmation ── */}
            {step === 'confirmation' && (
              <div className="w-full border border-[#C5A059]/20 bg-[#060606] p-12 lg:p-16 text-center">
                <div className="w-16 h-16 border border-[#C5A059]/40 flex items-center justify-center mx-auto mb-8">
                  <span className="text-2xl font-serif text-[#C5A059]">S.</span>
                </div>
                <span className="text-[8px] uppercase tracking-[0.4em] text-[#C5A059] block mb-4">Confirmed</span>
                <h2 className="text-3xl font-serif text-[#FDFBF7] mb-4 leading-tight">
                  Reservation<br />Secured.
                </h2>
                <p className="text-sm text-[#C8C0B0] leading-relaxed max-w-sm mx-auto mb-2">
                  Thank you, <span className="text-[#FDFBF7]">{formData.firstName}</span>. Your appointment for <span className="text-[#FDFBF7]">{selectedCategory?.name} ({selectedSize?.name})</span> has been entered into the ledger.
                </p>

                {selectedAddons.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#8A8070] mb-2">Including Extras:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {selectedAddons.map(a => (
                        <span key={a._id} className="text-[9px] px-2 py-1 bg-[#111] border border-[#222] text-[#C8C0B0]">
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {confirmationNumber && (
                  <div className="inline-block border border-[#C5A059]/30 bg-[#C5A059]/10 px-5 py-2 my-4">
                    <p className="text-[7px] uppercase tracking-[0.3em] text-[#8A8070] mb-1">Confirmation No.</p>
                    <p className="text-sm font-mono text-[#FDFBF7] tracking-wider">{confirmationNumber}</p>
                  </div>
                )}
                <p className="text-xs text-[#8A8070] mb-10">A formal confirmation will be dispatched to {formData.email}.</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleDownloadTicket}
                    className="bg-[#C5A059] text-black py-3 px-6 text-[9px] uppercase tracking-widest font-semibold hover:bg-[#DFBE82] transition-all flex items-center justify-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                    Download Ticket
                  </button>
                  <button
                    onClick={() => { setStep('category'); setSelectedCategory(null); setSelectedSize(null); setSelectedDate(null); setSelectedTime(''); /* keep formData persisted */ setConfirmationNumber(''); }}
                    className="border border-[#222] text-[#C8C0B0] hover:border-[#C5A059]/40 hover:text-[#FDFBF7] py-3 px-6 text-[9px] uppercase tracking-widest transition-all">
                    Book Another
                  </button>
                  <Link href="/" className="bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/20 py-3 px-6 text-[9px] uppercase tracking-widest transition-all">
                    Return Home
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
