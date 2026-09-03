import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getClientEcoleById } from "@/factories/clientFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string, ecoleId: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const ecoleId = (await params).ecoleId;
        if(!ecoleId) return NextResponse.json({message : "Requête invalide (Identifcation de l'école manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        const ecole = await getClientEcoleById(client.id, ecoleId);
        if (!ecole || ecole === null) return NextResponse.json({message : "Ecole non trouvée. Contactez votre administrateur"}, { status: 400 });
        return NextResponse.json({ecole: ecole}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Détails d'une école",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}