import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Addon from '@/models/Addon';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    try { jwt.verify(token, process.env.ADMIN_SECRET || 'fallback_secret'); return true; }
    catch { return false; }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();
        const addon = await Addon.findByIdAndUpdate(id, body, { new: true });
        if (!addon) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ addon });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        await connectToDatabase();
        const { id } = await params;
        await Addon.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Addon deleted' });
    } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
