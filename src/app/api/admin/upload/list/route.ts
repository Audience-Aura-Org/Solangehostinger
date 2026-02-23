import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

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
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        const files = await fs.readdir(uploadsDir);
        const items = await Promise.all(files.map(async (f) => {
            const stat = await fs.stat(path.join(uploadsDir, f));
            return { name: f, url: `/uploads/${f}`, size: stat.size, modified: stat.mtime };
        }));
        return NextResponse.json({ files: items });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
