import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import {getClientEcoleById, getClientEcoleEleves  } from "@/factories/clientFactory";
import { getEcoleById, updateEcole } from "@/factories/ADMIN_CLIENT/clientFactory";
import { UpdateEcoleDO } from "@/types/ADMIN_CLIENT/AdminClientUpdates";


export async function PATCH(request:NextRequest, { params }: { params: Promise<{clientCode: string, ecoleId: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const ecoleId = (await params).ecoleId;
        if(!ecoleId) return NextResponse.json({message : "Requête invalide (Identifcation de l'école manquant)"}, { status: 400 });
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const ecoleUpdateRequest:UpdateEcoleDO = {
            id                      : ecoleId,
            full_name               : body.full_name,
            short_name              : body.short_name,
            establishment_date      : new Date(body.establisment_date),
            primary_contact_name    : body.primary_contact_name,
            secondary_contact_name  : body.secondary_contact_name,
            contact_infos           : body.contact_infos,
            phone_number            : body.phone_number,
            email                   : body.email,
            website                 : body.website,
            notes                   : body.notes
        };
        
        const updatedEcole = await updateEcole(requestedRouteInfos.client.id, ecoleUpdateRequest, requestedRouteInfos.user.user_name);
        return NextResponse.json({ecole : updatedEcole}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Détails d'une école ",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}