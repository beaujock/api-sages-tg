import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getUser, getUserClient, getUserResources, getUserRoles } from "@/factories/userFactory";
import { generateToken } from "@/lib/auth";
import { getClientRoleMenuItems } from "@/factories/clientFactory";
import { SagesMenuItem } from "@/types/USERX/UserTypes";

export async function POST(request:NextRequest) {
    try {
        //request.headers.set("Access-Control-Allow-Origin", "*");
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const loginRequest = {
            clientCode : body.clientCode,
            userName : body.userName,
            password : body.password
        };
        if (!loginRequest.userName || !loginRequest.password || 
            loginRequest.userName === null || loginRequest.password === null) 
            return NextResponse.json("Informations de connexion manquantes", { status: 400 });
        const user = await getUser(loginRequest.userName, loginRequest.password);
        if (!user || user===null) return NextResponse.json("Utilisateur non trouvé", { status: 404 });
        const userClient = await getUserClient(user.id);
        if (!userClient || userClient===null) return NextResponse.json("Utilisateur non associé à un client", { status: 404 });
        if (loginRequest.clientCode.toUpperCase() !== userClient.code) return NextResponse.json("Utilisateur non associé au client", { status: 404 });
        const userRoles = await getUserRoles(user.id);
        const userResources = await getUserResources(user.id);
        let menuItems: SagesMenuItem[] = [];
        if (userRoles && userRoles.length === 1) {
            const roleCode = userRoles[0];
            menuItems = await getClientRoleMenuItems(userClient.code.toUpperCase(), roleCode.toUpperCase());
        };
        const connectionToken = generateToken({
            "first_login"       : user.first_login,
            "user" : {
                "id"        : user.id,
                "user_name" : user.user_name,
                "email"     : user.email,
                "roles"     : userRoles,
                "resources" : userResources,
                "menu_items" : menuItems
            }
        });
        
        const cookie_name = process.env.COOKIE_NAME;
        const expiry_date_time = new Date(Date.now() + Number(process.env.JWT_EXPIRES_IN!) * 60 * 60 * 1000);
        //const sessionAdded:boolean = await addUserSession(user.id, connectionToken, new Date(Date.now()), expiry_date_time);
        //return NextResponse.json({ message: "Succès : Connexion réussie", session_added : sessionAdded, token : connectionToken, cookie_name: cookie_name, effective_date : new Date(Date.now()),  expiry_date : expiry_date_time}, { status: 200 });
        return NextResponse.json({ message: "Succès : Connexion réussie", connectionToken : connectionToken, cookie_name: cookie_name, effective_date : new Date(Date.now()),  expiry_date : expiry_date_time, menu_items : menuItems }, { status: 200 });
        
    }
    catch(error:any){
        logError('F',"Echec Authentification",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}

