import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import { requireAdmin } from '@/lib/auth/middleware';
import { hashPassword } from '@/lib/auth/password';
import { createAdminNotification } from '@/lib/utils/notifications';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional(),
  role: z.enum(['admin', 'user']).default('user')
});

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    // Normalize user objects to use 'id' instead of '_id'
    const normalizedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      designation: user.designation || null,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    return NextResponse.json({
      success: true,
      users: normalizedUsers
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get users error:', error);
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
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password, name, designation, role } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      designation: designation || '',
      role: role || 'user'
    });

    // Create admin notification for user registration
    await createAdminNotification({
      type: 'user_registered',
      title: 'New User Registered',
      message: `New ${role || 'user'} account created: ${name} (${email.toLowerCase()})`,
      data: {
        userId: user._id.toString(),
        userName: name,
        userEmail: email.toLowerCase(),
        role: role || 'user'
      },
      priority: 'medium'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        designation: user.designation,
        role: user.role,
        isActive: user.isActive
      }
    }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
