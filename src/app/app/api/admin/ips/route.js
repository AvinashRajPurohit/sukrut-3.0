import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AllowedIP from '@/lib/db/models/AllowedIP';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';

const ipSchema = z.object({
  ipAddress: z.string().min(1, 'IP address is required'),
  description: z.string().optional()
});

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const ips = await AllowedIP.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      ips
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get IPs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    await requireAdmin();

    const body = await request.json();
    const validation = ipSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { ipAddress, description } = validation.data;

    // Check if IP already exists
    const existingIP = await AllowedIP.findOne({ ipAddress: ipAddress.trim() });
    if (existingIP) {
      return NextResponse.json(
        { error: 'IP address already exists' },
        { status: 400 }
      );
    }

    const ip = await AllowedIP.create({
      ipAddress: ipAddress.trim(),
      description: description?.trim() || ''
    });

    return NextResponse.json({
      success: true,
      ip: {
        id: ip._id.toString(),
        ipAddress: ip.ipAddress,
        description: ip.description,
        isActive: ip.isActive
      }
    }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Create IP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
