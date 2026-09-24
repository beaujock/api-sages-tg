import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getRoleByCode } from "@/factories/clientFactory";
import { getClientMenuItemLinks } from "@/factories/ADMIN_CLIENT/clientFactory";
import { getElevePhotoUrl } from "@/factories/ALL_USAGE/allUsageFactories";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const eleveMatricule = body.matricule;
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        const photoURL = await getElevePhotoUrl(clientCode,eleveMatricule);
        
        return NextResponse.json({photo: photoURL}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Liens (ecole)",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}