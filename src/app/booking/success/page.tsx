'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { jsPDF } from 'jspdf';

function SuccessContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [booking, setBooking] = useState<any | null>(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const bookingId = searchParams.get('booking_id');

        if (sessionId && bookingId) {
            console.log('Verifying payment:', sessionId);
            setStatus('success');

            fetch(`/api/bookings/${bookingId}`)
                .then(r => r.json())
                .then(data => setBooking(data.booking || null))
                .catch(() => setBooking(null));
        } else {
            setStatus('error');
        }
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-[9px] uppercase tracking-[0.5em] text-[#C5A059] animate-pulse">Verifying Payment...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <h1 className="text-3xl font-serif text-white mb-4">Payment Verification Failed</h1>
                <p className="text-sm text-[#8A8070] mb-8">We couldn't verify your payment. Please contact concierge if the deposit was charged.</p>
                <Link href="/booking" className="text-[#C5A059] text-[9px] uppercase tracking-widest border border-[#C5A059]/30 px-6 py-3 hover:bg-[#C5A059]/10 transition-all">
                    Return to Booking
                </Link>
            </div>
        );
    }

    const downloadTicket = () => {
        if (!booking) return;
        const doc = new jsPDF();

        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('serif', 'bold');
        doc.setFontSize(24);
        doc.text('SOLANGE', 105, 20, { align: 'center' });
        doc.setFontSize(8);
        doc.setTextColor(197, 160, 89);
        doc.text('SIGNATURE HAIR — LA MAISON DE BEAUTÉ', 105, 30, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text('OFFICIAL RESERVATION TICKET', 20, 55);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 58, 190, 58);

        doc.setFontSize(9);
        doc.text(`REFERENCE: ${booking.confirmationNumber}`, 20, 70);
        doc.text(`CLIENT: ${booking.clientName}`, 20, 80);
        doc.text(`SERVICE: ${booking.service}`, 20, 90);
        doc.text(`DATE: ${new Date(booking.date).toLocaleDateString()} at ${booking.time}`, 20, 100);
        doc.text(`TOTAL INVESTMENT: $${booking.price}`, 20, 110);
        doc.text(`HAIR COLOR: ${booking.hairColor || 'No specific selection'}`, 20, 120);

        if (booking.addons && booking.addons.length > 0) {
            doc.text('EXTRAS INCLUDED:', 20, 135);
            booking.addons.forEach((a: any, i: number) => {
                doc.text(`• ${a.name}`, 25, 142 + (i * 5));
            });
        }

        const startY = booking.addons && booking.addons.length > 0 ? 160 + (booking.addons.length * 5) : 140;
        doc.setFillColor(250, 250, 250);
        doc.rect(20, startY, 170, 40, 'F');
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(9);
        doc.text('LA MAISON LOCATION:', 30, startY + 10);
        doc.setFontSize(8);
        doc.text('6495 New Hampshire Ave, Hyattsville, MD', 30, startY + 18);
        doc.text('Contact: +1 301 454 9435', 30, startY + 24);
        doc.text('Email: Experience@solange.hair', 30, startY + 30);

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text('* $30 deposit is required to secure session. Non-refundable.', 20, 280);
        doc.text('* Any complaints must be reported within 3 days maximum.', 20, 285);

        doc.save(`Solange-Ticket-${booking.confirmationNumber}.pdf`);
    };

    return (
        <div className="max-w-xl mx-auto py-20 px-6 text-center">
            <div className="w-20 h-20 border border-[#C5A059]/20 flex items-center justify-center mx-auto mb-10">
                <span className="text-3xl font-serif text-[#C5A059]">S.</span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#C5A059] block mb-6">Payment Successful</span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#FDFBF7] mb-6 leading-tight">Reservation <br /> Secured.</h1>
            <p className="text-sm text-[#C8C0B0] leading-relaxed mb-6">Your deposit has been processed. Your session at La Maison is now confirmed in our ledger.</p>

            {booking ? (
                <div className="border border-[#141414] bg-[#060606] p-6 rounded mb-8 text-left">
                    <p className="text-[8px] uppercase tracking-widest text-[#5A5248] mb-2">Reference</p>
                    <p className="text-lg font-mono text-[#C5A059] tracking-widest mb-3">{booking.confirmationNumber}</p>

                    <p className="text-[8px] uppercase tracking-widest text-[#5A5248] mb-1">Service</p>
                    <p className="text-sm font-semibold text-[#FDFBF7] mb-2">{booking.service}</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-[#5A5248] mb-1">Date & Time</p>
                            <p className="text-sm text-[#FDFBF7]">{new Date(booking.date).toLocaleDateString()} — {booking.time}</p>
                        </div>
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-[#5A5248] mb-1">Stylist</p>
                            <p className="text-sm text-[#FDFBF7]">{booking.stylist || 'Assigned at salon'}</p>
                        </div>
                    </div>

                    {booking.hairColor && (
                        <div className="mt-4">
                            <p className="text-[8px] uppercase tracking-widest text-[#5A5248] mb-1">Preferred Hair Color(s)</p>
                            <p className="text-sm text-[#C5A059] italic uppercase">{booking.hairColor}</p>
                        </div>
                    )}

                    {booking.addons && booking.addons.length > 0 && (
                        <div className="mt-4">
                            <p className="text-[8px] uppercase tracking-widest text-[#5A5248] mb-2">Extras</p>
                            <ul className="list-disc list-inside text-sm text-[#FDFBF7]">
                                {booking.addons.map((a: any, i: number) => <li key={i}>{a.name}{a.price ? ` — $${a.price}` : ''}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className="mt-6 flex gap-3">
                        <button onClick={downloadTicket} className="bg-[#C5A059] text-black py-3 px-6 text-[9px] uppercase tracking-widest font-semibold hover:bg-[#DFBE82] transition-colors">Download Ticket (PDF)</button>
                        <Link href="/account" className="border border-[#141414] py-3 px-6 text-[9px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors">View My Ledger</Link>
                    </div>
                </div>
            ) : (
                <div className="inline-block border border-[#141414] bg-[#060606] px-8 py-5 mb-12">
                    <p className="text-[8px] uppercase tracking-widest text-[#5A5248] mb-2">Reference Number</p>
                    <p className="text-lg font-mono text-[#C5A059] tracking-widest">Confirmed</p>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <Link href="/" className="text-[#404040] hover:text-[#C5A059] text-[8px] uppercase tracking-[0.2em] transition-colors">Back to Maison Home</Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-[#080808] pt-32">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-[#C5A059] animate-pulse">Initializing...</p>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
