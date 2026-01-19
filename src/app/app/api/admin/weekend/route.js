import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import WeekendConfig from '@/lib/db/models/WeekendConfig';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';

const weekendSchema = z.object({
  weekendDays: z.array(z.number().min(0).max(6)).min(1, 'At least one weekend day is required')
});

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    let config = await WeekendConfig.findById('config');
    if (!config) {
      config = await WeekendConfig.create({ _id: 'config', weekendDays: [0, 6] });
    }

    return NextResponse.json({
      success: true,
      config: {
        weekendDays: config.weekendDays
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get weekend config error:', error);
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
    const validated = weekendSchema.parse(body);

    let config = await WeekendConfig.findById('config');
    if (!config) {
      config = await WeekendConfig.create({ _id: 'config', weekendDays: validated.weekendDays });
    } else {
      config.weekendDays = validated.weekendDays;
      await config.save();
    }

    return NextResponse.json({
      success: true,
      config: {
        weekendDays: config.weekendDays
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Update weekend config error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
