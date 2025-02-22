import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendMail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });

    // Send notification email
    await sendMail({
      to: process.env.ADMIN_EMAIL!,
      subject: `New Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    return NextResponse.json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 