import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getClientEleves } from "@/factories/clientFactory";
import { AdminClientCreateEleveDO } from "@/types/ADMIN_CLIENT/AdminClientCreates";
import { createEleve } from "@/factories/ADMIN_CLIENT/clientFactory";



export async function POST(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const eleveData:AdminClientCreateEleveDO = {
            last_name       : body.last_name,
            first_name      : body.first_name,
            other_names     : body.other_names,
            preferred_name  : body.preferred_name,
            date_of_birth   : new Date(body.date_of_birth),
            gender          : body.gender,
            phone_number    : body.phone_number,
            email           : body.email,
            notes           : body.notes,
            created_by      : "SAGES"
        };
        if (!eleveData.last_name?.trim() || !eleveData.first_name?.trim() || eleveData.date_of_birth === null || eleveData.gender === null)
            return NextResponse.json({message: "Informations de connexion manquantes"}, { status: 400 });
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        eleveData.created_by = requestedRouteInfos.user.user_name;
        const createdEleve = await createEleve(client.id, eleveData);
        return NextResponse.json({eleve: createdEleve}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Créer un élève",(new URL(request.url)).pathname, error.message, false);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}