import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await connectToDatabase();

        const existingAdmin = await User.findOne({ email: 'admin@solange.salon' });
        if (existingAdmin) {
            return NextResponse.json({ message: 'Admin user already exists. Login with: admin@solange.salon / password123' });
        }

        const hashedPassword = await bcrypt.hash('password123', 10);

        const adminUser = await User.create({
            name: 'Super Admin',
            email: 'admin@solange.salon',
            password: hashedPassword,
            role: 'admin',
        });

        return NextResponse.json({
            message: 'Admin user created successfully!',
            credentials: {
                email: 'admin@solange.salon',
                password: 'password123',
                role: adminUser.role,
            },
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
