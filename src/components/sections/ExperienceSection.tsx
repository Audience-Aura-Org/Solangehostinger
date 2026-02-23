'use client';

import { motion, Variants } from 'framer-motion';

const FEATURES = [
    {
        title: 'Hair Wash',
        description: 'At Princess Line Hair Braiding, we offer a complete hair care experience! Enjoy a refreshing hair wash with premium products to cleanse and prep your hair.',
    },
    {
        title: 'Hair Treatment',
        description: 'We also specialize in custom braiding services tailored to your unique look, using high-quality hair for flawless results. Walk in feeling fresh, leave feeling fabulous.',
    },
    {
        title: 'Braiding',
        description: 'Our expert hair braiding services include knotless box braids, cornrows, twists, and more—all done with gentle precision for lasting style and comfort.',
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

export default function ExperienceSection() {
    return (
        <section className="bg-[#080808] py-16 lg:py-24 px-6 lg:px-12 overflow-hidden border-t border-[#141414]">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="mb-16 space-y-4"
                >
                    <motion.span variants={itemVariants} className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] block">The Princess Line</motion.span>
                    <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-serif text-[#FDFBF7] leading-tight">
                        Complete <span className="italic font-light text-[#C5A059]">Artistry</span>.
                    </motion.h2>
                </motion.div>

                {/* Features Grid (Text Only) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid md:grid-cols-3 gap-10 lg:gap-16 mb-20"
                >
                    {FEATURES.map((f, i) => (
                        <motion.div key={f.title} variants={itemVariants} className="relative group">
                            <span className="absolute -left-6 -top-4 text-3xl font-serif text-[#C5A059]/10 group-hover:text-[#C5A059]/20 transition-colors">0{i + 1}</span>
                            <h3 className="text-xl font-serif text-[#FDFBF7] mb-4 border-b border-[#C5A059]/30 pb-2 inline-block">{f.title}</h3>
                            <p className="text-xs text-[#8A8070] font-light leading-relaxed tracking-wide">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Studio Info & Policies - Compacted */}
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start border-t border-[#141414] pt-16">
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.4em] text-[#C5A059] block mb-4">Maison Location</span>
                        <h3 className="text-2xl md:text-3xl font-serif text-[#FDFBF7] mb-6 leading-snug">
                            6495 New Hampshire Ave <br />
                            <span className="text-[#C5A059]">Hyattsville</span>
                        </h3>

                        <div className="flex flex-wrap gap-x-12 gap-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-px h-10 bg-[#C5A059]/40"></div>
                                <div>
                                    <span className="text-[9px] uppercase tracking-widest text-[#C5A059] block mb-1">Concierge</span>
                                    <p className="text-base text-[#FDFBF7] font-serif">+1 301 454 9435</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-px h-10 bg-[#222]"></div>
                                <div>
                                    <span className="text-[8px] uppercase tracking-widest text-[#C5A059] block mb-1">Reservation</span>
                                    <p className="text-[10px] text-[#FDFBF7] font-light">$30 deposit required</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-px h-10 bg-[#222]"></div>
                                <div>
                                    <span className="text-[8px] uppercase tracking-widest text-[#C5A059] block mb-1">QA</span>
                                    <p className="text-[10px] text-[#FDFBF7] font-light">Complaints: 3 days MAX</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] p-8 lg:p-10 border border-[#141414] rounded-xl flex items-center justify-between gap-8">
                        <div className="flex-1">
                            <span className="text-[9px] uppercase tracking-[0.4em] text-[#C5A059] block mb-4">Protocol</span>
                            <ul className="space-y-3 text-[11px] text-[#8A8070] font-light leading-snug">
                                <li className="flex gap-2">
                                    <span className="text-[#C5A059]">/</span>
                                    Extreme hygiene standards.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[#C5A059]">/</span>
                                    Hair pre-washed if possible.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-[#C5A059]">/</span>
                                    24h cancellation notice.
                                </li>
                            </ul>
                        </div>
                        <div className="hidden sm:block w-px h-20 bg-white/5"></div>
                        <div className="hidden sm:block text-center">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-[#404040] mb-2">Since</p>
                            <p className="text-xl font-serif text-[#C5A059]/50">2012</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
