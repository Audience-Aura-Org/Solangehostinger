import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_SECRET || process.env.NEXTAUTH_SECRET || 'fallback_secret_for_development_only';

export async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string; email: string };
        return decoded;
    } catch {
        return null;
    }
}

export async function isAdmin() {
    const user = await getAuthUser();
    return user && (user.role === 'admin' || user.role === 'staff');
}
