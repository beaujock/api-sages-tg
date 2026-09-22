import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos, getConnectedUser, userAndRouteAuthorized } from "@/lib/auth";
import { getClientByCode, getClientSalleClasses } from "@/factories/clientFactory";
import { getUserResources } from "@/factories/userFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;

        
        const clientSalleClasses = await getClientSalleClasses(client.id);
        return NextResponse.json({clientSalleClasses: clientSalleClasses}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Liste des écoles du client",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}