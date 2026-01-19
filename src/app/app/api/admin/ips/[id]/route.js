import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AllowedIP from '@/lib/db/models/AllowedIP';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';

const updateIPSchema = z.object({
  ipAddress: z.string().min(1, 'IP address is required').optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional()
});

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const body = await request.json();
    const validation = updateIPSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const ip = await AllowedIP.findById(params.id);
    if (!ip) {
      return NextResponse.json(
        { error: 'IP not found' },
        { status: 404 }
      );
    }

    if (validation.data.ipAddress && validation.data.ipAddress !== ip.ipAddress) {
      const existingIP = await AllowedIP.findOne({ ipAddress: validation.data.ipAddress.trim() });
      if (existingIP) {
        return NextResponse.json(
          { error: 'IP address already exists' },
          { status: 400 }
        );
      }
      ip.ipAddress = validation.data.ipAddress.trim();
    }

    if (validation.data.description !== undefined) {
      ip.description = validation.data.description?.trim() || '';
    }
    if (validation.data.isActive !== undefined) {
      ip.isActive = validation.data.isActive;
    }

    await ip.save();

    return NextResponse.json({
      success: true,
      ip: {
        id: ip._id.toString(),
        ipAddress: ip.ipAddress,
        description: ip.description,
        isActive: ip.isActive
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Update IP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const ip = await AllowedIP.findById(params.id);
    if (!ip) {
      return NextResponse.json(
        { error: 'IP not found' },
        { status: 404 }
      );
    }

    await AllowedIP.deleteOne({ _id: params.id });

    return NextResponse.json({
      success: true,
      message: 'IP deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Delete IP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
