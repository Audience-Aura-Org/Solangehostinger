'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to login');
            }

            router.push('/admin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 font-sans text-[#FDFBF7]">
            <div className="w-full max-w-md bg-[#111111] border border-[#222222] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center">

                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 font-medium">Restricted Access</span>
                <h1 className="text-3xl font-serif tracking-widest mb-10 text-center">LA MAISON<br />ADMIN</h1>

                {error && (
                    <div className="w-full bg-red-950/30 border border-red-900/50 text-red-200 text-xs text-center p-3 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="w-full space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-[#333] py-2 text-sm focus:border-[#C5A059] focus:outline-none transition-colors"
                            placeholder="admin@solange.salon"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-[#333] py-2 text-sm focus:border-[#C5A059] focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" className="w-full !mt-10" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Enter Dashboard'}
                    </Button>

                    <p className="text-center text-xs text-gray-600 mt-6 pb-2">
                        No account? Visit <a href="/api/auth/seed" target="_blank" className="text-[#C5A059] hover:underline">/api/auth/seed</a> to create the sample admin.
                    </p>
                </form>
            </div>
        </div>
    );
}
