import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getUser, getUserClient, getUserResources, getUserRoles } from "@/factories/userFactory";
import { generateToken } from "@/lib/auth";
import { getClientRoleMenuItems } from "@/factories/clientFactory";
import { SagesMenuItem } from "@/types/USERX/UserTypes";
import ms, { StringValue } from 'ms'

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
            return NextResponse.json({message: "Informations de connexion manquantes"}, { status: 400 });
        const user = await getUser(loginRequest.userName, loginRequest.password);
        if (!user || user===null) return NextResponse.json({message: "Utilisateur non trouvé"}, { status: 404 });
        const userClient = await getUserClient(user.id);
        if (!userClient || userClient===null) return NextResponse.json({message: "Utilisateur non associé à un client"}, { status: 404 });
        if (loginRequest.clientCode.toLowerCase() !== userClient.code) return NextResponse.json({message: "Utilisateur non associé au client"}, { status: 404 });
        const userRoles = await getUserRoles(user.id);
        const userResources = await getUserResources(user.id);
        let menuItems: SagesMenuItem[] = [];
        if (userRoles && userRoles.length === 1) {
            const roleCode = userRoles[0];
            menuItems = await getClientRoleMenuItems(userClient.code.toLowerCase(), roleCode.toUpperCase());
        };
        const cookie_name = process.env.COOKIE_NAME;
        const effective_date_time = new Date(Date.now());
        const expiry_date_time = new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN as StringValue));

        const connectionToken = await generateToken({
            "user_id"            : user.id,
            "user_full_name"     : user.user_full_name,
            "effective_date"     : effective_date_time,
            "expiry_date"        : expiry_date_time,
            "user_ip_address"    : request.headers.get('x-forwarded-for') || null,
            "user_agent"         : request.headers.get('user-agent') || null,
            "host"               : request.headers.get('host') || null,
        });
        
        
        return NextResponse.json({ message: "Succès : Connexion réussie", first_login : user.first_login, cookie_name: cookie_name, connectionToken : connectionToken, 
            roles : userRoles, resources : userResources, menu_items : menuItems, effective_date : effective_date_time,  expiry_date : expiry_date_time}, 
            { status: 200 });
        
    }
    catch(error:any){
        logError('F',"Echec Authentification",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}

