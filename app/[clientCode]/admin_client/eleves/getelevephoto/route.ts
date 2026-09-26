import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getElevePhotoUrl } from "@/factories/ALL_USAGE/allUsageFactories";
import { getEcoleById } from "@/factories/ADMIN_CLIENT/clientFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const eleveMatricule = body.matricule;
        const ecoleId = body.ecoleId;
        if (eleveMatricule===null || ecoleId===null) return NextResponse.json({message : "Identification de l'école et/ou matricule de l'élève manquant(s)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const ecole = await getEcoleById(ecoleId);
        if (ecole === null) return NextResponse.json({message : "Identification de l'école non valide"}, { status: 400 });
        const photoURL = await getElevePhotoUrl(clientCode,ecole.code, eleveMatricule);
        
        return NextResponse.json({photo: photoURL}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Liens (ecole)",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}