import jwt from 'jsonwebtoken';
import { stringifySetCookie } from 'cookie';
import type { Secret, SignOptions } from 'jsonwebtoken';
import { NextRequest } from "next/server";
import { getUserById } from '@/factories/userFactory';
import { isWithinInterval } from 'date-fns';
import { sgs_user } from './generated/prisma/client';



const JWT_SECRET:Secret = process.env.JWT_SECRET || '' // Use a strong default for development, but always use env in production
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

export async function getConnectedUser(req:NextRequest) : Promise<sgs_user|null> {
  try {
    const reqClone = req.clone();
    const authHeader = reqClone.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("Authorization header missing or malformed");
    const token = authHeader.split(' ')[1];

    /*const body = await reqClone.json().catch(()=>null);
    if (!body?.token) throw new Error("Token missing from request body");*/
    const decodedToken = jwt.verify(token, JWT_SECRET, { clockTolerance: 60 }) as jwt.JwtPayload;
    //const userInfos = (decodedToken.user) as string;
    //if (!userInfos) throw new Error("Token payload missing user information");
    //const userData = JSON.parse(userInfos);
    const userId = decodedToken.user.id;
    if(!userId || userId === null) return null;
    const user = await getUserById(userId);
    return user;
  }
  catch(error:any) {
    return null;
  }
}

export async function userAndRouteAuthorized(user:sgs_user, routeRoot:string) : Promise<boolean> {
  // the request will have a body containing a token
  // the decoded token will have the userId
  /*
  "userId" : "qewkfhgewfiuyqewgfwfygewoiquwyguyf"
  }
  */
  try {
    
    //const reqClone = req.clone();
    //const body = await reqClone.json().catch(()=>null);
    //if (!body?.token) throw new Error("Token missing from request body");
    /*
    const decodedToken = await jwt.verify(body.token, JWT_SECRET, { clockTolerance: 60 }) as jwt.JwtPayload;
    const userInfos = (decodedToken.sub || decodedToken.user) as string;
    if (!userInfos) throw new Error("Token payload missing user information");
    const userData = JSON.parse(userInfos);
    const userId = userData.userId;
    //const roles = userData.roles;
    //const resources = userData.resources;
    const user = await getUserById(userId);
    */
      if (user === null) throw new Error("User cannot be found");
    const userToken = user.token;
    if (userToken=== null) throw new Error("User token null");
    const tokenEffectiveDateTime = user.token_effective_time;
    const tokenExpiryDateTime = user.token_expiry_time;
    if (tokenEffectiveDateTime=== null || tokenExpiryDateTime===null) throw new Error("User token date/time null");
    const today = new Date(Date.now());
    const isBetween = isWithinInterval(today, { start: tokenEffectiveDateTime, end: tokenExpiryDateTime });
    if(!isBetween) throw new Error("token expired");
    const decodedUserToken = jwt.verify(userToken, JWT_SECRET, { clockTolerance: 60 }) as jwt.JwtPayload;
    const roles = (decodedUserToken.roles) as string;
    if (!roles) throw new Error("No user roles");
    if (!roles.includes(routeRoot.toUpperCase())) throw new Error("Route not authorized");
    return true;

    
  }
  catch(error:any) {
    return false;
  }
}