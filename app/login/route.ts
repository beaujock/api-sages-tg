import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { addUserSession, getUser, getUserRoles } from "@/factories/userFactory";
import { generateToken } from "@/lib/auth";

const ErrorOrigin = "userFactory";

export async function POST(request:NextRequest) {
    try {
        //request.headers.set("Access-Control-Allow-Origin", "*");
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const loginRequest = {
            userName : body.userName,
            password : body.password
        };
        if (!loginRequest.userName || !loginRequest.password || 
            loginRequest.userName === null || loginRequest.password === null) 
            return NextResponse.json("Informations de connexion manquantes", { status: 400 });
        const user = await getUser(loginRequest.userName, loginRequest.password);
        if (!user || user===null) return NextResponse.json("Utilisateur non trouvé", { status: 404 });
        const userRoles = await getUserRoles(user.id);
        const connectionToken = generateToken({
            "isAuthenticated"   : true,
            "first_login"       : user.first_login,
            "user" : {
                "id"        : user.id,
                "user_name" : user.user_name,
                "email"     : user.email,
                "roles"     : userRoles
            }
        });
        const cookie_name = process.env.COOKIE_NAME;
        const expiry_date_time = new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN!) * 60 * 60 * 1000);
        const sessionAdded:boolean = await addUserSession(user.id, connectionToken, new Date(Date.now()), expiry_date_time);
        return NextResponse.json({ message: "Succès : Connexion réussie", session_added : sessionAdded, token : connectionToken, cookie_name: cookie_name, effective_date : new Date(Date.now()),  expiry_date : expiry_date_time}, { status: 200 });
        
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}