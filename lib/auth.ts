import jwt from 'jsonwebtoken';
import { stringifySetCookie } from 'cookie';
import type { Secret, SignOptions } from 'jsonwebtoken';



const JWT_SECRET:Secret = process.env.JWT_SECRET! // Use a strong default for development, but always use env in production
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const generateToken = (payload: Record<string, any>) => {
  //const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
  return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string) => {
  //console.log("JWT secret : ", JWT_SECRET);
  //console.log("Token : ", token);
  try {
    const result = jwt.verify(token, JWT_SECRET, { clockTolerance: 60 });
    //console.log("Result : ", result);
    return result;
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

export const setAuthCookie = (res: any, token: string) => {
    const cookie = stringifySetCookie({
        name:'authToken',
        value:token,
        secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
        maxAge: 60 * 60 * 24 * 7, // 1 week (adjust as needed)
        path: '/', // Available across the entire site
        sameSite: 'strict', // Protects against CSRF attacks
    });
  res.setHeader('Set-Cookie', cookie);
};

export const clearAuthCookie = (res: any) => {
  const cookie = stringifySetCookie({
    name:'authToken', 
    value:'', 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expires immediately
    path: '/',
    sameSite: 'strict',
  });
  res.setHeader('Set-Cookie', cookie);
};