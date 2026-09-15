import { getClientRoleMenuItems, getRoleByCode } from "@/factories/clientFactory";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode:string }> }) {
    try {
            const clientCode = (await params).clientCode;
            if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
            const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
            if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
                return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
            const client = requestedRouteInfos.client;
            const userClientRoleMenuItems = await getClientRoleMenuItems(clientCode, "ADMIN_CLIENT");
            const roleInfos = await getRoleByCode("ADMIN_CLIENT");
            return NextResponse.json({menuItems : userClientRoleMenuItems, userFullName : requestedRouteInfos.user.full_name}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Menu d'un utilisateur",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}