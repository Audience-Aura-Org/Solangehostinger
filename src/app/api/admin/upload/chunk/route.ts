import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb', // Keeping under Vercel's strict 4.5MB Serverless limit
        },
    },
};

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_SECRET || process.env.NEXTAUTH_SECRET || 'fallback_secret';
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}

export async function POST(request: Request) {
    if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const rawText = await request.text();

        let body: any;
        try {
            body = JSON.parse(rawText);
        } catch {
            return NextResponse.json(
                { error: `Chunk could not be parsed: ${rawText.slice(0, 100)}` },
                { status: 400 }
            );
        }

        const { fileId, index, base64Data, filename, mime, totalSize, chunkSize, isFinal } = body;

        // Validation
        if (!fileId || typeof index !== 'number' || !base64Data) {
            return NextResponse.json({ error: 'Missing chunk fields' }, { status: 400 });
        }

        const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'image/gif'];
        if (mime && !ALLOWED.includes(mime)) {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        const buffer = Buffer.from(base64Data, 'base64');

        await connectToDatabase();
        const db = mongoose.connection.db as any;
        const filesColl = db.collection('uploads.files');
        const chunksColl = db.collection('uploads.chunks');

        const fileObjectId = new ObjectId(fileId);

        // 1. Insert this chunk
        await chunksColl.insertOne({
            files_id: fileObjectId,
            n: index,
            data: buffer,
        });

        // 2. If it is the final chunk, insert the master file record
        if (isFinal) {
            const safeName = `${Date.now()}-${(filename || 'file').replace(/[^a-zA-Z0-9.\-_]/g, '-')}`;

            await filesColl.insertOne({
                _id: fileObjectId,
                length: totalSize,
                chunkSize: chunkSize,
                uploadDate: new Date(),
                filename: safeName,
                metadata: { mime },
            });

            const url = `/api/uploads/${fileId}`;
            return NextResponse.json({ url, success: true, isFinal: true });
        }

        return NextResponse.json({ success: true, isFinal: false, index });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
