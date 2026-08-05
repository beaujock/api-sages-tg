
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

export async function generatePassword(minLength = 8) {
  // Force length to be at least 3 to fit all required categories
  const length = Math.max(minLength, 3);


  const upperSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberSet = '0123456789';
  const specialSet = ['!', '$', '%']; // Specified special characters
  const lowerSet = 'abcdefghijklmnopqrstuvwxyz';


  // Combine all character pools for filler characters
  const allChars = upperSet + numberSet + specialSet.join('') + lowerSet;


  // Helper to pick a random item from a string or array
  const getRandom = (source:any) => source[Math.floor(Math.random() * source.length)];


  // 1. Guarantee at least 1 of each required type
  const passwordChars = [
    getRandom(upperSet),
    getRandom(numberSet),
    getRandom(specialSet)
  ];


  // 2. Fill the remaining slots with random characters from the combined pool
  for (let i = passwordChars.length; i < length; i++) {
    passwordChars.push(getRandom(allChars));
  }


  // 3. Shuffle the array so guaranteed characters aren't always at the beginning
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }


  return passwordChars.join('');
}

