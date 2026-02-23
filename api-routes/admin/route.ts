import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AdminSettings from '@/models/AdminSettings';

export async function GET() {
  try {
    await connectToDatabase();

    let settings = await AdminSettings.findOne({});

    if (!settings) {
      // Create default settings if none exist
      settings = await AdminSettings.create({
        services: [
          { id: 'box-braids', name: 'Box Braids', price: 200, duration: 240, description: 'Classic box braids' },
          { id: 'cornrows', name: 'Cornrows', price: 120, duration: 180, description: 'Neat cornrow styles' },
          { id: 'locs', name: 'Locs', price: 150, duration: 240, description: 'Locs creation and maintenance' },
        ],
        stylists: [
          { id: 'solange', name: 'Solange Adeyemi', bio: 'Expert braider with 5+ years experience' },
          { id: 'chioma', name: 'Chioma Okonkwo', bio: 'Specialist in locs and natural hair' },
          { id: 'zainab', name: 'Zainab Hassan', bio: 'Creative designer and stylist' },
        ],
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    // Check admin auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const settings = await AdminSettings.findOneAndUpdate({}, body, { 
      new: true,
      upsert: true 
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
