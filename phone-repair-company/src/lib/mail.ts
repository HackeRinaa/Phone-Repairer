import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail(data: EmailData) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    ...data,
  });
} 