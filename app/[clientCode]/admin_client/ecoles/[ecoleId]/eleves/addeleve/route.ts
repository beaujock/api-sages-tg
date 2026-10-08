import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/ALL_USAGE/UtilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { CreateEleveDO } from "@/types/ADMIN_CLIENT/Creates";
import { createEleve, getEcoleById } from "@/factories/ADMIN_CLIENT/clientFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{clientCode: string, ecoleId: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const ecoleId = (await params).ecoleId;
        if(!ecoleId) return NextResponse.json({message : "Requête invalide (Identification de l'école manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 401 });
        const ecole = await getEcoleById(requestedRouteInfos.client.id, ecoleId);
        if (ecole === null) return NextResponse.json({message : "École inconnue pour ce client"}, { status: 400 });
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const eleveData:CreateEleveDO = {
            last_name       : body.last_name,
            first_name      : body.first_name,
            other_names     : body.other_names ?? null,
            preferred_name  : body.preferred_name ?? null,
            date_of_birth   : new Date(body.date_of_birth),
            gender          : body.gender,
            phone_number    : body.phone_number ?? null,
            email           : body.email ?? null,
            notes           : body.notes ?? null,
            created_by      : requestedRouteInfos.user.user_name
        };
        if (!eleveData.last_name?.trim() || !eleveData.first_name?.trim() || isNaN(eleveData.date_of_birth.getTime()) || !eleveData.gender?.trim())
            return NextResponse.json({message: "Informations de création d'un élève manquantes"}, { status: 400 });
        const eleve = await createEleve(requestedRouteInfos.client.id, eleveData);
        if (eleve === null) return NextResponse.json({message : "Echec de la création de l'élève"}, { status: 500 });

        return NextResponse.json({eleve : eleve}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Création d'un élève",(new URL(request.url)).pathname, error.message, false);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
