'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdmin && <Navigation />}
            <main className={isAdmin ? '' : 'min-h-screen'}>
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}
