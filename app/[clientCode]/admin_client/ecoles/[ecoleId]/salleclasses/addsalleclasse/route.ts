import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { AdminClientCreateSalleClasseDO } from "@/types/ADMIN_CLIENT/AdminClientCreates";
import { createSalleClasse, getClientEcoleSalleClasseByCode } from "@/factories/ADMIN_CLIENT/clientFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{clientCode: string, ecoleId: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const ecoleId = (await params).ecoleId;
        if(!ecoleId) return NextResponse.json({message : "Requête invalide (Identification de l'école manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 401 });
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const createSalleClasseData:AdminClientCreateSalleClasseDO = {
            ecole_id                 : body.ecole_id,
            classe_id                : body.classe_id,
            code                     : body.code,
            description              : body.description,
            notes                    : body.notes,
            created_by               : requestedRouteInfos.user.user_name
        };
        if (createSalleClasseData.ecole_id === null  || createSalleClasseData.classe_id === null ||
            createSalleClasseData.code === null || createSalleClasseData.created_by === null)
            return NextResponse.json({message: "Informations de création d'une classe manquantes"}, { status: 400 });
        const existingSalleclasse = await getClientEcoleSalleClasseByCode(requestedRouteInfos.client.id, ecoleId,createSalleClasseData.code.toUpperCase());
        if (existingSalleclasse) return NextResponse.json({message: "Une classe du même code existe déjà"}, { status: 400 });
        const salleClasse = await createSalleClasse(requestedRouteInfos.client.id, createSalleClasseData);

        return NextResponse.json({salleClasse : salleClasse}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Liste des classes d'une ecole",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}