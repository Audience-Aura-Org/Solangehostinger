import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AdminSettings from '@/models/AdminSettings';
import Addon from '@/models/Addon';

// Helper to generate consistent IDs
const genId = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const SERVICES = [
    {
        id: genId('Extra Small Knotless'),
        name: 'Extra Small Knotless',
        category: 'Knotless Braids',
        description: 'Ultra-fine, long-lasting protective style with minimal tension.',
        sizes: [
            { id: genId('XS Shoulder'), size: 'Shoulder Length', price: 320, duration: 420 },
            { id: genId('XS Mid Back'), size: 'Mid Back', price: 350, duration: 480 },
            { id: genId('XS Waist'), size: 'Waist Length', price: 380, duration: 540 },
            { id: genId('XS Hip'), size: 'Hip Length', price: 420, duration: 600 },
            { id: genId('XS Thigh'), size: 'Thigh Length', price: 450, duration: 660 },
        ],
    },
    {
        id: genId('Small Knotless'),
        name: 'Small Knotless',
        category: 'Knotless Braids',
        description: 'Classic small knotless braids for a seamless, natural look.',
        sizes: [
            { id: genId('S Bob'), size: 'Bob Length', price: 250, duration: 300 },
            { id: genId('S Shoulder'), size: 'Shoulder Length', price: 250, duration: 300 },
            { id: genId('S Mid Back'), size: 'Mid Back', price: 300, duration: 360 },
            { id: genId('S Waist'), size: 'Waist Length', price: 300, duration: 360 },
            { id: genId('S Hip'), size: 'Hip Length', price: 350, duration: 420 },
            { id: genId('S Thigh'), size: 'Thigh Length', price: 400, duration: 480 },
        ],
    },
    {
        id: genId('Medium Knotless'),
        name: 'Medium Knotless',
        category: 'Knotless Braids',
        description: 'Versatile medium-sized braids for everyday elegance.',
        sizes: [
            { id: genId('M Bob'), size: 'Bob Length', price: 150, duration: 180 },
            { id: genId('M Shoulder'), size: 'Shoulder Length', price: 150, duration: 180 },
            { id: genId('M Mid Back'), size: 'Mid Back', price: 180, duration: 240 },
            { id: genId('M Waist'), size: 'Waist Length', price: 180, duration: 240 },
            { id: genId('M Hip'), size: 'Hip Length', price: 220, duration: 300 },
            { id: genId('M Thigh'), size: 'Thigh Length', price: 250, duration: 360 },
        ],
    },
    {
        id: genId('Large Knotless'),
        name: 'Large Knotless',
        category: 'Knotless Braids',
        description: 'Bold, beautiful, and faster to install.',
        sizes: [
            { id: genId('L Bob'), size: 'Bob Length', price: 150, duration: 150 },
            { id: genId('L Shoulder'), size: 'Shoulder Length', price: 150, duration: 150 },
            { id: genId('L Mid Back'), size: 'Mid Back', price: 170, duration: 180 },
            { id: genId('L Waist'), size: 'Waist Length', price: 170, duration: 180 },
            { id: genId('L Hip'), size: 'Hip Length', price: 200, duration: 240 },
            { id: genId('L Thigh'), size: 'Thigh Length', price: 230, duration: 300 },
        ],
    },
    {
        id: genId('Jumbo Knotless'),
        name: 'Jumbo Knotless',
        category: 'Knotless Braids',
        description: 'Extreme volume and quick installation for a dramatic statement.',
        sizes: [
            { id: genId('J Mid Back'), size: 'Mid Back', price: 150, duration: 120 },
            { id: genId('J Waist'), size: 'Waist Length', price: 150, duration: 120 },
            { id: genId('J Hip'), size: 'Hip Length', price: 180, duration: 180 },
        ],
    },
    {
        id: genId('Boho Knotless'),
        name: 'Boho Knotless',
        category: 'Boho / Goddess Braids',
        description: 'Beautiful knotless braids with loose curly strands throughout.',
        sizes: [
            { id: genId('Boho S Shoulder'), size: 'Small Shoulder', price: 250, duration: 300 },
            { id: genId('Boho S Mid'), size: 'Small Mid Back', price: 300, duration: 360 },
            { id: genId('Boho S Waist'), size: 'Small Waist', price: 330, duration: 420 },
            { id: genId('Boho M Shoulder'), size: 'Medium Shoulder', price: 180, duration: 240 },
            { id: genId('Boho M Waist'), size: 'Medium Waist', price: 250, duration: 300 },
        ],
    },
    {
        id: genId('Goddess Box Braids'),
        name: 'Goddess Box Braids',
        category: 'Boho / Goddess Braids',
        description: 'Classic box braids with curly ends or loose strands.',
        sizes: [
            { id: genId('GBB S Shoulder'), size: 'Small Shoulder', price: 250, duration: 300 },
            { id: genId('GBB S Waist'), size: 'Small Waist', price: 300, duration: 360 },
        ],
    },
    {
        id: genId('Straight Back Cornrows'),
        name: 'Straight Back Cornrows',
        category: 'Cornrows',
        description: 'Classic uniform cornrows for a clean and sleek look.',
        sizes: [
            { id: genId('SB 2'), size: '2 Braids', price: 50, duration: 45 },
            { id: genId('SB 4'), size: '4 Braids', price: 50, duration: 60 },
            { id: genId('SB 6'), size: '6 Braids', price: 70, duration: 90 },
            { id: genId('SB 8'), size: '8 Braids', price: 90, duration: 120 },
            { id: genId('SB 10'), size: '10 Braids', price: 100, duration: 150 },
            { id: genId('SB 12'), size: '12 Braids', price: 120, duration: 180 },
        ],
    },
    {
        id: genId('Feed-In Cornrows'),
        name: 'Feed-In Cornrows',
        category: 'Cornrows',
        description: 'Cornrows where extensions are added gradually for a more natural root.',
        sizes: [
            { id: genId('FI 2'), size: '2 Feed-In', price: 40, duration: 60 },
            { id: genId('FI 4'), size: '4 Feed-In', price: 40, duration: 90 },
            { id: genId('FI 6'), size: '6 Feed-In', price: 70, duration: 120 },
            { id: genId('FI 8'), size: '8 Feed-In', price: 90, duration: 150 },
            { id: genId('FI 10'), size: '10 Feed-In', price: 110, duration: 180 },
        ],
    },
    {
        id: genId('Stitch Braids'),
        name: 'Stitch Braids',
        category: 'Cornrows',
        description: 'Textured cornrows with horizontal lines (stitches) for extra detail.',
        sizes: [
            { id: genId('ST 2'), size: '2 Stitch', price: 60, duration: 75 },
            { id: genId('ST 4'), size: '4 Stitch', price: 60, duration: 100 },
            { id: genId('ST 6'), size: '6 Stitch', price: 90, duration: 140 },
            { id: genId('ST 8'), size: '8 Stitch', price: 120, duration: 180 },
        ],
    },
    {
        id: genId('Tribal Fulani Braids'),
        name: 'Tribal / Fulani Braids',
        category: 'Cornrows',
        description: 'Intricate patterns with extensions, symbolic of the Fulani people.',
        sizes: [
            { id: genId('TF Shoulder'), size: 'Shoulder Length', price: 200, duration: 180 },
            { id: genId('TF Mid Back'), size: 'Mid Back', price: 220, duration: 240 },
            { id: genId('TF Waist'), size: 'Waist Length', price: 250, duration: 300 },
        ],
    },
    {
        id: genId('Lemonade Braids'),
        name: 'Lemonade Braids',
        category: 'Cornrows',
        description: 'Long-side-swept cornrows made famous by the iconic style.',
        sizes: [
            { id: genId('LB Shoulder'), size: 'Shoulder', price: 150, duration: 150 },
            { id: genId('LB Mid Back'), size: 'Mid Back', price: 180, duration: 210 },
            { id: genId('LB Waist'), size: 'Waist', price: 200, duration: 240 },
        ],
    },
    {
        id: genId('Senegalese Twists'),
        name: 'Senegalese Twists',
        category: 'Twists',
        description: 'Smooth, uniform two-strand twists for a elegant look.',
        sizes: [
            { id: genId('ST Small Shoulder'), size: 'Small Shoulder', price: 250, duration: 300 },
            { id: genId('ST Small Waist'), size: 'Small Waist', price: 300, duration: 360 },
            { id: genId('ST Medium Shoulder'), size: 'Medium Shoulder', price: 200, duration: 240 },
            { id: genId('ST Medium Waist'), size: 'Medium Waist', price: 250, duration: 300 },
        ],
    },
    {
        id: genId('Kids Knotless'),
        name: "Kids Knotless",
        category: 'Kids Services',
        description: 'Tension-free knotless braids scaled for children.',
        sizes: [
            { id: genId('Kids K Mid'), size: 'Mid Back', price: 150, duration: 180 },
        ],
    },
    {
        id: genId('Kids Box Braids'),
        name: "Kids Box Braids",
        category: 'Kids Services',
        description: 'Classic box braids scaled for children.',
        sizes: [
            { id: genId('Kids BB Mid'), size: 'Mid Back', price: 150, duration: 150 },
        ],
    },
    {
        id: genId('Kids Cornrows'),
        name: "Kids Cornrows",
        category: 'Kids Services',
        description: 'Simple and protective children\'s cornrows.',
        sizes: [
            { id: genId('Kids CR 4'), size: '4 Braids', price: 40, duration: 60 },
            { id: genId('Kids CR 6'), size: '6 Braids', price: 50, duration: 90 },
            { id: genId('Kids CR 8'), size: '8 Braids', price: 70, duration: 120 },
        ],
    },
];

const ADDONS = [
    { name: 'Extra Length', price: 30, description: 'Optional additional length beyond catalog sizes.' },
    { name: 'Extra Fullness', price: 40, description: 'Increased braid density for a thicker look.' },
    { name: 'Takedown', price: 70, description: 'Professional removal and Detangling of previous style.' },
    {
        name: 'Boho Option',
        price: 30,
        description: 'Addition of loose curly strands to Tribal/Fulani braids.',
        linkedCategories: [genId('Tribal Fulani Braids')] // This links by service ID in this model
    },
];

export async function GET() {
    try {
        await connectToDatabase();

        // 1. Update AdminSettings (Services)
        const settings = await AdminSettings.findOneAndUpdate(
            {},
            { $set: { services: SERVICES } },
            { new: true, upsert: true }
        );

        // 2. Update Addons
        const addonTasks = ADDONS.map(async (a) => {
            return Addon.findOneAndUpdate(
                { name: a.name },
                { $set: { ...a, active: true } },
                { upsert: true, new: true }
            );
        });

        const updatedAddons = await Promise.all(addonTasks);

        return NextResponse.json({
            message: 'Prices updated successfully',
            servicesCount: settings.services.length,
            addonsCount: updatedAddons.length,
            services: settings.services.map(s => `${s.category}: ${s.name}`),
            addons: updatedAddons.map(a => a.name)
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
