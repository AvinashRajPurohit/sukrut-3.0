import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
  role: z.string().min(1, 'Role is required'),
  inquiry: z.string().min(1, 'Inquiry type is required'),
  message: z.string().min(1, 'Message is required'),
  phone: z.string().optional(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, country, role, inquiry, message, phone } = validation.data;

    // Get SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpSecure = process.env.SMTP_SECURE === 'true';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactEmail = process.env.CONTACT_EMAIL || 'hr@thesukrut.com';

    // Validate SMTP configuration
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('SMTP configuration is missing');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Map inquiry types to readable labels
    const inquiryLabels = {
      general: 'General Inquiry',
      support: 'Technical Support',
      sales: 'Sales Question',
      feature: 'Feature Request',
      billing: 'Billing Issue',
      other: 'Other'
    };

    // Map role types to readable labels
    const roleLabels = {
      ceo: 'CEO / Founder',
      cto: 'CTO / Technical Lead',
      manager: 'Project Manager',
      developer: 'Developer',
      other: 'Other'
    };

    // Map country codes to readable names
    const countryLabels = {
      usa: 'USA',
      uk: 'United Kingdom',
      canada: 'Canada',
      india: 'India',
      australia: 'Australia'
    };

    // Prepare email content
    const emailSubject = `New Contact Form Submission: ${inquiryLabels[inquiry] || inquiry}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #E39A2E; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; margin-bottom: 5px; display: block; }
            .value { color: #333; }
            .message-box { background-color: white; padding: 15px; border-left: 4px solid #E39A2E; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${firstName} ${lastName}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              ${phone ? `<div class="field">
                <span class="label">Phone:</span>
                <span class="value">${phone}</span>
              </div>` : ''}
              <div class="field">
                <span class="label">Country:</span>
                <span class="value">${countryLabels[country] || country}</span>
              </div>
              <div class="field">
                <span class="label">Role:</span>
                <span class="value">${roleLabels[role] || role}</span>
              </div>
              <div class="field">
                <span class="label">Inquiry Type:</span>
                <span class="value">${inquiryLabels[inquiry] || inquiry}</span>
              </div>
              <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}Country: ${countryLabels[country] || country}
Role: ${roleLabels[role] || role}
Inquiry Type: ${inquiryLabels[inquiry] || inquiry}

Message:
${message}
    `;

    // Send email
    const mailOptions = {
      from: `"${firstName} ${lastName}" <${smtpUser}>`,
      replyTo: email,
      to: contactEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully. We will get back to you soon!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    // Handle specific nodemailer errors
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { error: 'Email authentication failed. Please check SMTP credentials.' },
        { status: 500 }
      );
    }
    
    if (error.code === 'ECONNECTION') {
      return NextResponse.json(
        { error: 'Could not connect to email server. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again later.' },
      { status: 500 }
    );
  }
}
