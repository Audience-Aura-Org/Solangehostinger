'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] py-16 px-6 lg:px-12 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-12 border-b border-[#1A1A1A] pb-16 mb-8">

        <div className="flex flex-col items-center md:items-start mx-auto md:mx-0">
          <Link href="/" className="group flex flex-col items-center md:items-start mx-auto md:mx-0">
            <span className="font-serif font-medium text-4xl tracking-[0.3em] text-[#FDFBF7] block hover:opacity-70 transition-opacity">
              SOLANGE
            </span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-[#C5A059] mt-1 opacity-70">
              Signature Hair
            </span>
          </Link>
          <p className="text-[#FDFBF7]/40 text-sm font-light tracking-wide max-w-sm mx-auto md:mx-0">
            La Maison de Beauté. Unparalleled craftsmanship, precision, and luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-[#FDFBF7]/40 text-xs uppercase tracking-[0.2em] w-full md:w-auto text-center md:text-left">

          <div className="flex flex-col gap-4 items-center md:items-start mx-auto md:mx-0">
            <h4 className="text-[#C5A059] mb-4 font-medium">Menu</h4>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/about" className="hover:text-white transition-colors">La Maison</Link>
            <Link href="/booking" className="hover:text-white transition-colors">Reserve</Link>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start mx-auto md:mx-0">
            <h4 className="text-[#C5A059] mb-4 font-medium">Social</h4>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">editorial</a>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start mx-auto md:mx-0 col-span-1">
            <h4 className="text-[#C5A059] mb-4 font-medium text-center md:text-left">Concierge</h4>
            <span className="text-[#FDFBF7]/60">6495 New Hampshire Ave</span>
            <span className="text-[#FDFBF7]/60">Hyattsville, MD</span>
            <span className="text-[#FDFBF7]/80">+1 301 454 9435</span>
            <span>Experience@solange.hair</span>
          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[#FDFBF7]/20 text-[10px] uppercase tracking-[0.2em] gap-6 text-center">
        <p>&copy; {currentYear} SOLANGE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 justify-center">
          <Link href="/privacy" className="hover:text-[#FDFBF7] transition-colors">Privacité</Link>
          <Link href="/terms" className="hover:text-[#FDFBF7] transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
