import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/ALL_USAGE/UtilitiesFactory";
import { getClientUserRouteRequestInfos} from "@/lib/auth";
import { getSettings, updateSettings } from "@/factories/ADMIN_CLIENT/clientFactory";


export async function PATCH(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {

        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const anneeScolaireId = body.annee_scolaire_id;
        if(!anneeScolaireId || anneeScolaireId===null) return NextResponse.json("Requête invalide (année scolaire manquant)", { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;

        const updatedSettings = await updateSettings(client.id, anneeScolaireId, requestedRouteInfos.user.user_name);
        return NextResponse.json({settings: updatedSettings}, { status: 200 });
        //return NextResponse.json({client: client, clientEcolesOverviews: clientEcolesOverview}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Liste des écoles du client",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}


