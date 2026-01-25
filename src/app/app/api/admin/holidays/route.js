import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Holiday from '@/lib/db/models/Holiday';
import { requireAdmin } from '@/lib/auth/middleware';
import { createAdminNotification } from '@/lib/utils/notifications';
import { z } from 'zod';
import { startOfDay, format } from 'date-fns';

const holidaySchema = z.object({
  name: z.string().min(1, 'Holiday name is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  type: z.enum(['holiday', 'weekend']).default('holiday'),
  isRecurring: z.boolean().default(false),
  description: z.string().optional()
});

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const query = {};
    if (year) {
      const startDate = new Date(parseInt(year), month ? parseInt(month) - 1 : 0, 1);
      const endDate = new Date(parseInt(year), month ? parseInt(month) : 11, 31, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const holidays = await Holiday.find(query).sort({ date: 1 });

    return NextResponse.json({
      success: true,
      holidays
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get holidays error:', error);
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
    const validated = holidaySchema.parse(body);

    const holiday = await Holiday.create({
      ...validated,
      date: startOfDay(new Date(validated.date))
    });

    // Create admin notification for holiday addition
    await createAdminNotification({
      type: 'holiday_added',
      title: 'Holiday Added',
      message: `New ${validated.type === 'holiday' ? 'holiday' : 'weekend'} added: ${validated.name} on ${format(holiday.date, 'MMM d, yyyy')}${validated.isRecurring ? ' (Recurring)' : ''}`,
      data: {
        holidayId: holiday._id.toString(),
        holidayName: validated.name,
        date: holiday.date,
        type: validated.type,
        isRecurring: validated.isRecurring
      },
      priority: 'low'
    });

    return NextResponse.json({
      success: true,
      holiday
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message ?? 'Validation failed' },
        { status: 400 }
      );
    }
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Holiday already exists for this date' },
        { status: 400 }
      );
    }
    console.error('Create holiday error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
