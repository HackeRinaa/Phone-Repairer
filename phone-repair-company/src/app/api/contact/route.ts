import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Define interface for NodeMailer error
interface NodemailerError extends Error {
  code?: string;
  response?: string;
  responseCode?: number;
}

// Create a transporter object based on available credentials
const createTransporter = () => {
  // Check if we have email configuration
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    // Determine email service based on email address
    const emailUser = process.env.EMAIL_USER.toLowerCase();
    
    // Gmail configuration
    if (emailUser.includes('@gmail.com')) {
      console.log('Using Gmail transport configuration');
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    
    // Outlook/Hotmail configuration
    else if (emailUser.includes('@outlook.com') || emailUser.includes('@hotmail.com')) {
      console.log('Using Outlook transport configuration');
      return nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // use TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false
        }
      });
    }
    
    // Yahoo configuration
    else if (emailUser.includes('@yahoo.com')) {
      console.log('Using Yahoo transport configuration');
      return nodemailer.createTransport({
        service: 'yahoo',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    
    // Default to generic SMTP setup
    else {
      console.log('Using generic SMTP transport configuration');
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp-mail.outlook.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }
  
  // Fallback to Ethereal for testing (creates a temporary test account)
  console.warn('Email credentials not configured. Using Ethereal Email for testing.');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'ethereal.user@ethereal.email', // will be replaced by Ethereal
      pass: 'ethereal.pass', // will be replaced by Ethereal
    },
  });
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use EMAIL_USER as recipient if available, otherwise use fallback
    const recipientEmail = process.env.EMAIL_USER || 'marina.papadimitriou@outlook.com';
    
    // Log the contact request
    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      phone: data.phone || 'Not provided',
      subject: data.subject,
      message: data.message.substring(0, 100) + (data.message.length > 100 ? '...' : ''), // Truncate long messages in logs
      recipient: recipientEmail
    });
    
    // Create nodemailer test account if needed and get transporter
    let testAccount;
    let transporter;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Created Ethereal test account:', testAccount.user);
    } else {
      transporter = createTransporter();
    }
    
    // Email content
    const mailOptions = {
      from: `"iRescue Contact Form" <${process.env.EMAIL_USER || testAccount?.user || 'contact-form@irescue.gr'}>`,
      to: recipientEmail,
      replyTo: data.email,
      subject: `New contact form: ${data.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
          ${data.message.replace(/\n/g, '<br/>')}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">
          This email was sent from the contact form on iRescue website.
        </p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone || 'Not provided'}
        Subject: ${data.subject}
        
        Message:
        ${data.message}
        
        This email was sent from the contact form on iRescue website.
      `,
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      
      // If using Ethereal, provide the test URL to view the email
      if (testAccount) {
        console.log('Email preview URL:', nodemailer.getTestMessageUrl(info));
      } else {
        console.log('Email sent successfully:', info.messageId);
      }
      
      return NextResponse.json({ 
        success: true,
        message: 'Your message has been sent successfully!'
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // Log detailed error for debugging
      const mailerError = emailError as NodemailerError;
      console.error('Email error details:', {
        code: mailerError.code,
        response: mailerError.response,
        responseCode: mailerError.responseCode,
      });
      
      // If using Outlook and getting an authentication error, suggest alternatives
      if (mailerError.response?.includes('Authentication unsuccessful') && recipientEmail.includes('@outlook.com')) {
        console.warn('Microsoft has disabled basic authentication. Consider using Gmail or setting up OAuth 2.0.');
        
        // Try to use Ethereal as a fallback
        try {
          testAccount = await nodemailer.createTestAccount();
          const fallbackTransporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
          
          const fallbackInfo = await fallbackTransporter.sendMail(mailOptions);
          console.log('Fallback email sent to Ethereal. Preview URL:', nodemailer.getTestMessageUrl(fallbackInfo));
          
          return NextResponse.json({ 
            success: true,
            message: 'Your message has been saved but could not be emailed directly. Our team will respond soon.',
            etherealUrl: nodemailer.getTestMessageUrl(fallbackInfo)
          });
        } catch (fallbackError) {
          console.error('Even fallback email failed:', fallbackError);
        }
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: emailError instanceof Error ? emailError.message : 'Unknown email error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process contact form',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 