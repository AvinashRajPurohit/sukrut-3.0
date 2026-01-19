import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import AttendanceConfig from '@/lib/db/models/AttendanceConfig';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';

const configSchema = z.object({
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:mm:ss)'),
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:mm:ss)'),
  lateThresholdMinutes: z.number().int().min(0),
  earlyLeaveThresholdMinutes: z.number().int().min(0),
  requireReasonOnLate: z.boolean(),
  requireReasonOnEarly: z.boolean()
});

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    let config = await AttendanceConfig.findById('config');
    if (!config) {
      config = await AttendanceConfig.create({ _id: 'config' });
    }

    return NextResponse.json({
      success: true,
      config: {
        startTime: config.startTime,
        endTime: config.endTime,
        lateThresholdMinutes: config.lateThresholdMinutes,
        earlyLeaveThresholdMinutes: config.earlyLeaveThresholdMinutes,
        requireReasonOnLate: config.requireReasonOnLate,
        requireReasonOnEarly: config.requireReasonOnEarly
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get config error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    await requireAdmin();

    const body = await request.json();
    const validation = configSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    let config = await AttendanceConfig.findById('config');
    if (!config) {
      config = await AttendanceConfig.create({
        _id: 'config',
        ...validation.data
      });
    } else {
      Object.assign(config, validation.data);
      await config.save();
    }

    return NextResponse.json({
      success: true,
      config: {
        startTime: config.startTime,
        endTime: config.endTime,
        lateThresholdMinutes: config.lateThresholdMinutes,
        earlyLeaveThresholdMinutes: config.earlyLeaveThresholdMinutes,
        requireReasonOnLate: config.requireReasonOnLate,
        requireReasonOnEarly: config.requireReasonOnEarly
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Update config error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
