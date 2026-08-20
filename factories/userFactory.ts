import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { ResourceCombo, UserBaseInfos } from "@/types/USERX/UserTypes";
import { logError } from "./utilitiesFactory";
import { sgs_user } from "@/lib/generated/prisma/client";

const ErrorOrigin = "userFactory";

export async function getUser(login:string|null, password:string|null) : Promise<UserBaseInfos|null>{
    const functionName = "getUser";
    try {
        let user;
        if (login ===null || password === null) return null; //login or pasword cannot be null
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const emailUser = await prisma.sgs_user.findUnique({
            where : {
                email : login
            }
        });
        if (emailUser === null) user = null; else user = emailUser;
        const userNameUser = await prisma.sgs_user.findUnique({
            where : {
                user_name : login
            }
        });
        if (userNameUser === null) user = null; else user = userNameUser;
        if (user === null) throw new Error("Utilisateur non trouvé");
        const bcrypt = require('bcrypt');
        const isPasswordValid = await bcrypt.compare(password, user.pwd_hash);
        if (!isPasswordValid) throw new Error("Nom d'utilisateur/email et/ou mot de passe incorrect(s)");
        return {
            id: user.id,
            user_name : user.user_name,
            email : user.email,
            first_login : user.first_login
        }
    }
    catch(error:any) {
        logError('N',"Echec : Retrouver un utilisateur",ErrorOrigin + "-" + functionName, error.message, false);
        return null;
        //throw new Error(ErrorOrigin + "-" + functionName + error.message);
    }
}

export async function getUserRoles(userId : string) : Promise<string[]> {
    const functionName = "getUserRoles - ";
    try {
        const userRoles : string[] = [];
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const today = new Date(Date.now());
        const roles = await prisma.sgs_user_role.findMany({
            where: {
                user_id: userId,
                status: 'A',
                OR: [
                    {
                        effective_date: { lte: today },
                        expiry_date: null,
                    },
                    {
                        expiry_date: { not: null, gte: today },
                        effective_date: { lte: today },
                    },
                ],
            },
            select : {
                tg_role : {
                    select : {
                        code : true
                    }
                }
            }
        });
        roles.forEach(role =>{
            userRoles.push(role.tg_role.code);
        });
        
        return [...new Set(userRoles)];
    }
    catch(error:any){
        logError('N',"Echec : Retrouver les roles d'un utilisateur",ErrorOrigin + "-" + functionName, error.message, false);
        return [];
        //throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function addUserSession(userId:string, token:string, effective_date : Date, expiry_date : Date) : Promise<boolean> {
    const functionName = "addUserSession";
  try {
    if (!userId || !token || !effective_date || !expiry_date) return false;
    const isConnected = await verifyAndSetPrismaConnection();
    if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
    const userUpdated = await prisma.sgs_user.update({
      where : {
        id : userId
      },
      data : {
        token : token,
        token_effective_time : effective_date,
        token_expiry_time : expiry_date
      }
    });
    if (!userUpdated) {
      return false;
    }
    return true;
  }
  catch(error:any) {
    logError('N',"Echec : Ajout session d'utilisateur",ErrorOrigin + "-" + functionName, error.message, false);
    return false;
    //throw new Error(ErrorOrigin + functionName + error.message);
  }
}

export async function changeUserPassword(userId:string, oldPassword:string, newPassword:string, firstLogin:boolean, changer : string) : Promise<boolean> {
    const functionName = "changeUserPassword";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const saltRounds = Number(process.env.SALT_ROUNDS);
        const bcrypt = require('bcrypt');
        //const hashedOldPassword = await bcrypt.hash(oldPassword, saltRounds);
        //console.log("Old password hashed = ", hashedOldPassword);
        const theUser = await prisma.sgs_user.findUnique({
            where : {
                id : userId,
                //pwd_hash : hashedOldPassword
            }
        });
        //console.log("The User", theUser);
        
        if (!theUser || theUser === null) return false;
        const isPasswordValid = await bcrypt.compare(oldPassword, theUser.pwd_hash);
        //console.log("current password hashed = ", theUser.pwd_hash);
        if (!isPasswordValid) return false;
        
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        //update the user new password, user will have to get re-authenticated
        const updatedUser = await prisma.sgs_user.update({
            where : {
                id : userId
            },
            data : {
                pwd_hash : hashedNewPassword,
                first_login : false,
                token : null,
                token_effective_time : null,
                token_expiry_time : null,
                change_date : new Date(Date.now()),
                changed_by : changer
            }
        });
        if (!updatedUser || updatedUser===null) return false;
        return true;
    }
    catch(error:any) {
        logError('N',"Echec : Changement de mot de passe",ErrorOrigin + "-" + functionName, error.message, false);
        return false;
    }
}

export async function getUserResources(userId : string) : Promise<ResourceCombo[]> {
    const functionName = "getUserResources";
    
    try {
        const userResources : ResourceCombo[] = [];
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const today = new Date(Date.now());
        const resources = await prisma.sgs_user_resource.findMany({
            where: {
                user_id: userId,
                status: 'A',
            },
            select : {
                type_resource : true,
                resource_id :true
            }
        });
        resources.forEach(resource =>{
            userResources.push({
                type_resource : resource.type_resource,
                resource_id : resource.resource_id
            });
        });
        
        return [...new Set(userResources)];
    }
    catch(error:any){
        logError('N',"Echec : Retrouver les roles d'un utilisateur",ErrorOrigin + "-" + functionName, error.message, false);
        return [];
        //throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getUserById(userId : string) : Promise<sgs_user|null> {
    const functionName = "getUserById";
    
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const today = new Date(Date.now());
        const user = await prisma.sgs_user.findUnique({
            where: {
                id: userId,
            }
        });
        return user;
    }
    catch(error:any){
        logError('N',"Echec : Retrouver un utilisateur par son identifiant",ErrorOrigin + "-" + functionName, error.message, false);
        return null;
        //throw new Error(ErrorOrigin + functionName + error.message);
    }
}