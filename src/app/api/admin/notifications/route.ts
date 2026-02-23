import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    try {
        jwt.verify(token, process.env.ADMIN_SECRET || 'fallback_secret');
        return true;
    } catch {
        return false;
    }
}

export async function GET() {
    if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        await connectToDatabase();
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(100);
        return NextResponse.json({ notifications });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
