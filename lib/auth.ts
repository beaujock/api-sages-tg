import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { stringifySetCookie } from 'cookie';
import { NextRequest } from "next/server";
import { getUserById, getUserTypeResources } from '@/factories/userFactory';
import { isWithinInterval } from 'date-fns';
import { sgs_user } from './generated/prisma/client';
import { routeRequestedInfos } from '@/types/USERX/UserTypes';
import { getClientByCode } from '@/factories/clientFactory';
import { logError } from '@/factories/utilitiesFactory';

const JWT_SECRET_STRING = process.env.JWT_SECRET as string; // Use a strong default for development, but always use env in production
const secretKey = new TextEncoder().encode(JWT_SECRET_STRING);

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


export const generateToken = async (payload: Record<string, any>) => {
  // To use expiration: .setExpirationTime(JWT_EXPIRES_IN as string)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt() // Best practice: records exactly when the token was created
    .setExpirationTime(JWT_EXPIRES_IN) // Enforces the token lifespan
    .sign(secretKey);
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secretKey, { clockTolerance: 60 });
    return payload;
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

export const setAuthCookie = (res: any, token: string) => {
    const cookie = stringifySetCookie({
        name: 'authToken',
        value: token,
        secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
        maxAge: 60 * 60 * 24 * 7, // 1 week (adjust as needed)
        path: '/', // Available across the entire site
        sameSite: 'strict', // Protects against CSRF attacks
    });
  res.setHeader('Set-Cookie', cookie);
};

export const clearAuthCookie = (res: any) => {
  const cookie = stringifySetCookie({
    name: 'authToken', 
    value: '', 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expires immediately
    path: '/',
    sameSite: 'strict',
  });
  res.setHeader('Set-Cookie', cookie);
};

export async function getConnectedUser(req: NextRequest) : Promise<sgs_user|null> {
  try {
    const reqClone = req.clone();
    const authHeader = reqClone.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("Authorization header missing or malformed");
    const token = authHeader.split(' ')[1];

    const { payload: decodedToken } = await jwtVerify(token, secretKey, { clockTolerance: 60 });
    
    // Type casting the user object from the payload
    const userPayload = decodedToken.user as Record<string, any>;
    const userId = userPayload?.id;
    
    if (!userId || userId === null) return null;
    
    const user = await getUserById(userId);
    return user;
  }
  catch(error: any) {
    return null;
  }
}

export async function userAndRouteAuthorized(user: sgs_user|null, routeRoot: string) : Promise<boolean> {
  try {
    if (user === null) throw new Error("User cannot be found");
    const userToken = user.token;
    if (userToken === null) throw new Error("User token null");
    
    const tokenEffectiveDateTime = user.token_effective_time;
    const tokenExpiryDateTime = user.token_expiry_time;
    if (tokenEffectiveDateTime === null || tokenExpiryDateTime === null) throw new Error("User token date/time null");
    
    const isBetween = isWithinInterval(new Date(), { start: tokenEffectiveDateTime, end: tokenExpiryDateTime });
    if (!isBetween) throw new Error("token expired");
    
    const { payload: decodedUserToken } = await jwtVerify(userToken, secretKey, { clockTolerance: 60 });
    const userPayload = decodedUserToken.user as Record<string, any>;
    const roles = userPayload?.roles as string;
    
    if (!roles) throw new Error("No user roles");
    if (!roles.includes(routeRoot.toUpperCase())) throw new Error("Route not authorized");
    
    return true;
  }
  catch(error: any) {
    return false;
  }
}

export async function getClientUserRouteRequestInfos(req: NextRequest|null, clientCode:string|null, routeRoot:string|null, resourceType:string|null) : Promise<routeRequestedInfos> {
  try {
    let message = "";
    let resources:string[] = [];
    const nullResponse:routeRequestedInfos = {
      client : null,
      user : null,
      route : null,
      allowed : false,
      resources : [],
      message : "Requête invalide"
    };

    if (req === null || clientCode === null || routeRoot === null || resourceType=== null) return nullResponse;
    
    const client = await getClientByCode(clientCode);
    const user = await getConnectedUser(req);
    const authorized = await userAndRouteAuthorized(user, routeRoot);

    if (client === null) message = message + " Client non trouvé";
    if (user === null) message = message + " Utilisateur non trouvé";
    if (!authorized) message = message + " Utilisateur non authorisé";
    if (user !== null) resources = await getUserTypeResources(user.id, resourceType.toUpperCase());
    if (resources.length === 0) message = message + " Aucune resource associée a cet utilisateur";

    return {
      client : client,
      user : user,
      route : routeRoot,
      allowed : authorized,
      resources : resources,
      message : message
    }
  }
  catch(error:any) {
    logError('F',"Echec : Repose requête","getClientUserRouteRequestInfos", error.message, true);
    return {
      client : null,
      user : null,
      route : routeRoot,
      allowed : false,
      resources : [],
      message : "ERROR : " + error.message
    }
  }
}