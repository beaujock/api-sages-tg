import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getClientActiveUsers, getClientEcoles, getClientModules } from "@/factories/clientFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client == null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        const clientEcoles = await getClientEcoles(client.id);
        const clientModules = await getClientModules(client.id);
        const clientActiveUsers = await getClientActiveUsers(client.id);
        return NextResponse.json({clientEcoles: clientEcoles, clientModules: clientModules, clientActiveUsers: clientActiveUsers}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Administrateur client - Tableau de bord",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}