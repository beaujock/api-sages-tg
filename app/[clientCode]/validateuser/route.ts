import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos, getConnectedUser, verifyToken } from "@/lib/auth";
import { isWithinInterval } from 'date-fns';
import { SagesToken } from "@/types/ALL_USAGE/AllUsagesTypes";
import { getUserResources, getUserRoles } from "@/factories/userFactory";
import { SagesMenuItem } from "@/types/USERX/UserTypes";
import { getClientByCode, getClientRoleMenuItems } from "@/factories/clientFactory";

export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {

        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const client = await getClientByCode(clientCode.toLowerCase());
        if (!client || client=== null) return NextResponse.json({message : "client non connu"}, { status: 400 });
        const user = await getConnectedUser(request);

        /*const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const user = requestedRouteInfos.user;
        const client = requestedRouteInfos.client;*/

        if (!user || user=== null) return NextResponse.json({message : "Utilisateur non connu"}, { status: 400 });
        const userRoles = await getUserRoles(user.id);
        /*const userResources = await getUserResources(user.id);
        let menuItems: SagesMenuItem[] = [];
        if (userRoles && userRoles.length === 1) {
            const roleCode = userRoles[0];
            menuItems = await getClientRoleMenuItems(client.code.toLowerCase(), roleCode.toUpperCase());
        };

        //request.headers.set("Access-Control-Allow-Origin", "*");
        */
        return NextResponse.json({"user_id" : user.id,  first_login : user.first_login, roles : userRoles}, 
            { status: 200 });
    }
    catch(error:any){
        logError('F',"Vérification de jeton",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
