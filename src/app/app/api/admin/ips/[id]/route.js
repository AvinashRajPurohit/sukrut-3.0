import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AllowedIP from '@/lib/db/models/AllowedIP';
import { requireAdmin } from '@/lib/auth/middleware';
import { createAdminNotification } from '@/lib/utils/notifications';
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

    // Handle params as Promise (Next.js 15+) or object (older versions)
    let ipId;
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      ipId = resolvedParams?.id;
    } catch (paramError) {
      console.error('Error resolving params:', paramError);
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      );
    }

    if (!ipId) {
      return NextResponse.json(
        { error: 'IP ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = updateIPSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const ip = await AllowedIP.findById(ipId);
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

    // Handle params as Promise (Next.js 15+) or object (older versions)
    let ipId;
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      ipId = resolvedParams?.id;
    } catch (paramError) {
      console.error('Error resolving params:', paramError);
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      );
    }

    if (!ipId) {
      return NextResponse.json(
        { error: 'IP ID is required' },
        { status: 400 }
      );
    }

    const ip = await AllowedIP.findById(ipId);
    if (!ip) {
      return NextResponse.json(
        { error: 'IP not found' },
        { status: 404 }
      );
    }

    const ipAddress = ip.ipAddress;
    await AllowedIP.deleteOne({ _id: ipId });

    // Create notification for IP removal
    await createAdminNotification({
      type: 'ip_removed',
      title: 'IP Address Removed',
      message: `IP address removed: ${ipAddress}${ip.description ? ` - ${ip.description}` : ''}`,
      data: {
        ipAddress: ipAddress,
        description: ip.description || ''
      },
      priority: 'low'
    });

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
