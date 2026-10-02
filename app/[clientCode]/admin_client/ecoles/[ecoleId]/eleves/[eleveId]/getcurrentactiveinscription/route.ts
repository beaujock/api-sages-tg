import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getEleveCurrentActiveInscription } from "@/factories/ADMIN_CLIENT/clientFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string, ecoleId: string, eleveId: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const ecoleId = (await params).ecoleId;
        if(!ecoleId) return NextResponse.json({message : "Requête invalide (Identifcation de l'école manquant)"}, { status: 400 });
        const eleveId = (await params).eleveId;
        if(!eleveId) return NextResponse.json({message : "Requête invalide (Identifcation de l'élève manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        const inscription = await getEleveCurrentActiveInscription(client.id, eleveId, ecoleId);
        return NextResponse.json({inscription: inscription}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Inscription active d'un élève pour l'année scolaire en cours",(new URL(request.url)).pathname, error.message, false);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
