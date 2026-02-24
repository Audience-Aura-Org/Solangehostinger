'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/hooks/useTheme';

type Position = 'bottom-right' | 'bottom-left' | 'top-right';
type Style = 'bubble' | 'bar' | 'minimal';

export default function ConversationTrigger({
  position = 'bottom-right',
  style = 'bubble',
  message = "Ready to book? Let's schedule your appointment.",
  buttonText = 'Book Now',
}: {
  position?: Position;
  style?: Style;
  message?: string;
  buttonText?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const positionClasses = {
    'bottom-right': 'bottom-24 md:bottom-8 right-6 md:right-8',
    'bottom-left': 'bottom-24 md:bottom-8 left-6 md:left-8',
    'top-right': 'top-32 right-6 md:right-8',
  };

  if (style === 'bubble') {
    return (
      <div
        className={`fixed ${positionClasses[position]} z-[80] hidden md:block`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Message Bubble */}
        {isOpen && (
          <div
            className={`mb-4 px-6 py-4 rounded-3xl shadow-2xl backdrop-blur-md border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              theme === 'light'
                ? 'bg-white/95 border-black/10 text-black'
                : 'bg-dark-surface/95 border-white/10 text-primary'
            }`}
          >
            <p className="text-sm font-light leading-relaxed mb-3">{message}</p>
            <Link href="/booking">
              <button
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
                  theme === 'light'
                    ? 'text-primary hover:text-black'
                    : 'text-accent hover:text-primary'
                }`}
              >
                {buttonText} →
              </button>
            </Link>
          </div>
        )}

        {/* Floating Button */}
        <Link href="/booking">
          <button
            className={`w-16 h-16 rounded-full shadow-lg backdrop-blur-md border flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              theme === 'light'
                ? 'bg-primary/90 border-black/20 text-white hover:bg-primary'
                : 'bg-accent/90 border-accent/30 text-dark hover:bg-accent'
            }`}
            title={buttonText}
            aria-label={buttonText}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </button>
        </Link>
      </div>
    );
  }

  if (style === 'bar') {
    return (
      <div
        className={`fixed ${positionClasses[position]} z-[80] max-w-xs transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-75 hover:opacity-100'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div
          className={`px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md border flex items-center justify-between gap-4 group cursor-pointer ${
            theme === 'light'
              ? 'bg-white/90 border-black/10'
              : 'bg-dark-surface/90 border-white/10'
          }`}
        >
          <div className={`text-sm font-light ${theme === 'light' ? 'text-black' : 'text-primary'}`}>
            {message}
          </div>
          <Link href="/booking">
            <button
              className={`whitespace-nowrap px-4 py-2 rounded-lg transition-all text-xs uppercase tracking-[0.15em] font-medium ${
                theme === 'light'
                  ? 'bg-primary text-white hover:bg-black'
                  : 'bg-accent text-dark hover:bg-primary'
              }`}
            >
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Minimal style
  return (
    <Link href="/booking">
      <div
        className={`fixed ${positionClasses[position]} z-[80] group cursor-pointer`}
        title={buttonText}
      >
        <div
          className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 ${
            theme === 'light'
              ? 'bg-black/60 text-white hover:bg-black border border-white/20'
              : 'bg-accent/60 text-dark hover:bg-accent border border-accent/30'
          }`}
        >
          {buttonText}
        </div>
      </div>
    </Link>
  );
}
