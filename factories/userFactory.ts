import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { UserConnectInfos } from "@/types/UserTypes";

const ErrorOrigin = "userFactory";

export async function getUser(login:string|null, password:string|null) : Promise<UserConnectInfos|null>{
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
            user_name : user.user_name,
            email : user.email,
            token : user.token,
            token_effective_time : user.token_effective_time,
            token_expiry_time : user.token_expiry_time
        }
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + "-" + functionName + error.message);
    }
}