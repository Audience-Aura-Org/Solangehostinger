'use client';

import Image from 'next/image';

const GALLERY_IMAGES = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
    '/images/6.png',
    '/images/7.png',
    '/images/8.png',
    '/images/9.png',
    '/images/10.png',
    '/images/11.png',
    '/images/12.png',
];

export default function GallerySection() {
    return (
        <section className="bg-dark py-32 lg:py-52 overflow-hidden border-t border-surface">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
                <span className="text-[10px] uppercase tracking-[0.5em] text-accent block mb-6">Archive</span>
                <h2 className="text-4xl md:text-7xl font-serif text-primary">Editorial <span className="italic font-light text-accent">Portfolio</span>.</h2>
            </div>

            <div className="flex overflow-x-auto gap-4 md:gap-6 px-6 lg:px-12 pb-12 no-scrollbar snap-x">
                {GALLERY_IMAGES.map((img, i) => (
                    <div key={i} className="flex-none w-[200px] md:w-[280px] aspect-[4/5] relative rounded-xl overflow-hidden border border-surface bg-black/20 snap-center group">
                        <Image
                            src={img}
                            alt={`Gallery Image ${i + 1}`}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="transition-all duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 200px, 280px"
                            priority={i < 4}
                        />
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 text-center">
                <p className="text-muted text-[10px] uppercase tracking-[0.4em]">Editorial Collection 2024 • Scroll to explore</p>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
