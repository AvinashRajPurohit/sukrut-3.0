import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Holiday from '@/lib/db/models/Holiday';
import { requireAdmin } from '@/lib/auth/middleware';
import { z } from 'zod';
import { startOfDay } from 'date-fns';

const holidaySchema = z.object({
  name: z.string().min(1, 'Holiday name is required').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  type: z.enum(['holiday', 'weekend']).optional(),
  isRecurring: z.boolean().optional(),
  description: z.string().optional()
});

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const { id } = params;
    const body = await request.json();
    const validated = holidaySchema.parse(body);

    const updateData = { ...validated };
    if (validated.date) {
      updateData.date = startOfDay(new Date(validated.date));
    }

    const holiday = await Holiday.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!holiday) {
      return NextResponse.json(
        { error: 'Holiday not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      holiday
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
    console.error('Update holiday error:', error);
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

    const { id } = params;
    const holiday = await Holiday.findByIdAndDelete(id);

    if (!holiday) {
      return NextResponse.json(
        { error: 'Holiday not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Holiday deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Delete holiday error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
