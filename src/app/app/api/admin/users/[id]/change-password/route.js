import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import { requireAdmin } from '@/lib/auth/middleware';
import { hashPassword, comparePassword } from '@/lib/auth/password';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().optional(), // Optional for admin
  newPassword: z.string().min(6, 'Password must be at least 6 characters')
});

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const body = await request.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If current password is provided, verify it (for user self-service)
    // Admin can change password without providing current password
    if (validation.data.currentPassword) {
      const isPasswordValid = await comparePassword(validation.data.currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
    }

    // Check if new password is different from current (only if current password was verified)
    // Admin can set same password if needed, but we'll still check to prevent accidental same password
    if (validation.data.currentPassword) {
      const isSamePassword = await comparePassword(validation.data.newPassword, user.password);
      if (isSamePassword) {
        return NextResponse.json(
          { error: 'New password must be different from current password' },
          { status: 400 }
        );
      }
    }

    // Update password
    user.password = await hashPassword(validation.data.newPassword);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
