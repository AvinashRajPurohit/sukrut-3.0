import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET() {
  try {
    await connectDB();
    const { id } = await requireAuth();

    const user = await User.findById(id).select('faceDescriptor').lean();
    const registered = !!(user?.faceDescriptor && Array.isArray(user.faceDescriptor) && user.faceDescriptor.length === 128);

    return NextResponse.json({ success: true, registered });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Face status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
