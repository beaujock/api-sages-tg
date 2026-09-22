import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getRoleByCode } from "@/factories/clientFactory";
import { getClientMenuItemLinks } from "@/factories/ADMIN_CLIENT/clientFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        const role = await getRoleByCode("ADMIN_CLIENT");
        if (!role) return NextResponse.json({message : "Role non trouvé. Contactez votre administrateur"}, { status: 400 });
        const links = await getClientMenuItemLinks(client.id, role.id, "INSCRIPTIONS");
        return NextResponse.json({links: links}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Liens (inscriptions)",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}