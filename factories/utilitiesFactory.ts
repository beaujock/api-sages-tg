

'use server';

import nodemailer from 'nodemailer';

export async function sendEmail(formData:any) {
  const name = formData.name;
  const email = formData.email;
  const message = formData.message;

  // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_FROM}>`,
      to: email, // Recipient email address
      //replyTo: process.env.SMTP_USER,
      subject: "Requête d'utilisation de SAGES",
      text: message,
    });

    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, message: 'Failed to send email. Please try again.' };
  }
}

export async function generateCode(length : number) {
  const characters = 'RSTUA23PQBCDEFGHY67IJKLMNOVWXZ014589';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}