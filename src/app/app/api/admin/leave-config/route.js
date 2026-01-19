import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import LeaveConfig from '@/lib/db/models/LeaveConfig';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';

const leaveConfigSchema = z.object({
  sickLeave: z.object({
    limit: z.number().min(0),
    period: z.enum(['yearly', 'monthly'])
  }),
  paidLeave: z.object({
    limit: z.number().min(0),
    period: z.enum(['yearly', 'monthly'])
  }),
  unpaidLeave: z.object({
    limit: z.number().min(0).optional(), // Optional for unpaid leave
    period: z.enum(['yearly', 'monthly']).optional() // Optional for unpaid leave
  }).optional(), // Entire object is optional
  workFromHome: z.object({
    limit: z.number().min(0),
    period: z.enum(['yearly', 'monthly'])
  })
});

export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    let config = await LeaveConfig.findById('leaveConfig');

    if (!config) {
      config = await LeaveConfig.create({ _id: 'leaveConfig' });
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Error fetching leave config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    await requireAdmin();

    const body = await request.json();
    const validation = leaveConfigSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Get existing config to preserve unpaidLeave if it exists
    let existingConfig = await LeaveConfig.findById('leaveConfig');
    
    // Prepare update data, preserving unpaidLeave from existing config if not provided
    const updateData = {
      ...validation.data,
      updatedAt: Date.now()
    };
    
    // If unpaidLeave exists in database but not in update, preserve it
    if (existingConfig && existingConfig.unpaidLeave && !validation.data.unpaidLeave) {
      updateData.unpaidLeave = existingConfig.unpaidLeave;
    }
    
    let config = await LeaveConfig.findByIdAndUpdate(
      'leaveConfig',
      updateData,
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, config });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Error updating leave config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
