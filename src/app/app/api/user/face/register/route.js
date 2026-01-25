import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

const DESCRIPTOR_LENGTH = 128;

export async function POST(request) {
  try {
    await connectDB();
    const { id } = await requireAuth();

    const body = await request.json().catch(() => ({}));
    const raw = body.faceDescriptor;

    if (!Array.isArray(raw) || raw.length !== DESCRIPTOR_LENGTH) {
      return NextResponse.json(
        { error: 'Invalid face descriptor. Must be an array of 128 numbers.' },
        { status: 400 }
      );
    }

    const faceDescriptor = raw.slice(0, DESCRIPTOR_LENGTH).map(Number);
    if (faceDescriptor.some((n) => typeof n !== 'number' || !Number.isFinite(n))) {
      return NextResponse.json(
        { error: 'All face descriptor values must be finite numbers.' },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(id, {
      faceDescriptor,
      faceRegisteredAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Face register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
