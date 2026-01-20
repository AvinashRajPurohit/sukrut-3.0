import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import { requireAdmin } from '@/lib/auth/middleware';
import { hashPassword } from '@/lib/auth/password';
import { createAdminNotification } from '@/lib/utils/notifications';
import { z } from 'zod';

const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  designation: z.union([z.string(), z.literal(''), z.null()]).optional(),
  role: z.enum(['admin', 'user']).optional(),
  isActive: z.boolean().optional()
});

export async function GET(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    // Handle params as Promise (Next.js 15+) or object (older versions)
    const resolvedParams = params instanceof Promise ? await params : params;
    const userId = resolvedParams.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return designation - check the actual value from database
    let designationToReturn = null;
    if (user.designation !== null && user.designation !== undefined) {
      if (typeof user.designation === 'string') {
        const trimmed = user.designation.trim();
        designationToReturn = trimmed || null;
      } else {
        designationToReturn = String(user.designation);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        designation: designationToReturn,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    // Handle params as Promise (Next.js 15+) or object (older versions)
    let userId;
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      userId = resolvedParams?.id;
    } catch (paramError) {
      console.error('Error resolving params:', paramError);
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      );
    }

    if (!userId) {
      console.error('User ID is missing. Params:', params);
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('Error parsing request body:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    console.log('Received body:', JSON.stringify(body));
    
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation failed:', validation.error.errors);
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    console.log('Validation success, data:', JSON.stringify(validation.data));

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found with ID:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Current user designation before update:', user.designation);

    // Track if user is being deactivated
    const wasActive = user.isActive;
    
    // Update fields directly on the user document
    if (validation.data.email && validation.data.email !== user.email) {
      const existingUser = await User.findOne({ email: validation.data.email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
      user.email = validation.data.email.toLowerCase();
    }
    
    if (validation.data.name) user.name = validation.data.name;
    
    // Always update designation if it's in the payload
    if ('designation' in validation.data) {
      let designationValue;
      if (validation.data.designation === null || validation.data.designation === undefined || validation.data.designation === '') {
        designationValue = null;
      } else {
        designationValue = String(validation.data.designation).trim();
      }
      // Use set() to ensure Mongoose recognizes the field
      user.set('designation', designationValue);
      user.markModified('designation'); // Explicitly mark as modified
      console.log('Setting designation to:', JSON.stringify(designationValue), 'Type:', typeof designationValue, 'from validation.data.designation:', JSON.stringify(validation.data.designation));
      console.log('User designation after set:', user.designation);
      console.log('User isModified designation:', user.isModified('designation'));
    }
    
    if (validation.data.role !== undefined) user.role = validation.data.role;
    if (validation.data.isActive !== undefined) user.isActive = validation.data.isActive;
    
    if (validation.data.password) {
      user.password = await hashPassword(validation.data.password);
    }

    // Save the user document
    console.log('About to save user. Modified paths:', user.modifiedPaths());
    console.log('User designation before save:', user.designation);
    const savedUser = await user.save();
    console.log('User saved. Designation in user object after save:', savedUser.designation);
    console.log('User document after save (toObject):', JSON.stringify(savedUser.toObject(), null, 2));
    console.log('User document after save (toJSON):', JSON.stringify(savedUser.toJSON(), null, 2));

    // Try direct database query using mongoose connection to verify the field was saved
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const dbUser = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
    console.log('Direct MongoDB query - designation:', dbUser?.designation);
    console.log('Direct MongoDB query - full object:', JSON.stringify(dbUser, null, 2));

    // Reload user to ensure we have the latest data from database
    const updatedUser = await User.findById(userId).select('-password');
    console.log('Reloaded user designation:', updatedUser.designation);
    console.log('Reloaded user designation type:', typeof updatedUser.designation);
    console.log('Reloaded user full object:', JSON.stringify(updatedUser.toObject(), null, 2));

    // Create notification if user was deactivated
    if (wasActive && !updatedUser.isActive) {
      await createAdminNotification({
        type: 'user_deactivated',
        title: 'User Deactivated',
        message: `User account deactivated: ${updatedUser.name} (${updatedUser.email})`,
        data: {
          userId: updatedUser._id.toString(),
          userName: updatedUser.name,
          userEmail: updatedUser.email
        },
        priority: 'high'
      });
    }

    // Return designation - check the actual value from database
    let designationToReturn = null;
    if (updatedUser.designation !== null && updatedUser.designation !== undefined) {
      if (typeof updatedUser.designation === 'string') {
        const trimmed = updatedUser.designation.trim();
        designationToReturn = trimmed || null;
      } else {
        designationToReturn = String(updatedUser.designation);
      }
    }
    console.log('Final designation to return:', JSON.stringify(designationToReturn));

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        designation: designationToReturn,
        role: updatedUser.role,
        isActive: updatedUser.isActive
      }
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Update user error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    // Handle params as Promise (Next.js 15+) or object (older versions)
    let userId;
    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      userId = resolvedParams?.id;
    } catch (paramError) {
      console.error('Error resolving params:', paramError);
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete - deactivate instead of deleting
    user.isActive = false;
    await user.save();

    // Create notification for user deactivation
    await createAdminNotification({
      type: 'user_deactivated',
      title: 'User Deactivated',
      message: `User account deactivated: ${user.name} (${user.email})`,
      data: {
        userId: user._id.toString(),
        userName: user.name,
        userEmail: user.email
      },
      priority: 'high'
    });

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      );
    }
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
