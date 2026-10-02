import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getAnneeScolaireById } from "@/factories/ALL_USAGE/SagesTgFactory";
import { getClientCurrentAnneeScolaire, getEcoleEnseignants } from "@/factories/ADMIN_CLIENT/clientFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const body = await request.json();
        if(!body) return NextResponse.json({message : "Requête invalide"}, { status: 400 });
        const ecoleId = body.ecoleId;
        if(!ecoleId) return NextResponse.json({message : "Requête invalide (Identifcation de l'école manquant)"}, { status: 400 });
        const anneeScolaireId = body.anneeScolaireId;
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        const anneeScolaire = anneeScolaireId
            ? await getAnneeScolaireById(anneeScolaireId)
            : await getClientCurrentAnneeScolaire(client.id);
        if (!anneeScolaire) return NextResponse.json({message : anneeScolaireId ? "Année scolaire introuvable" : "Aucune année scolaire en cours"}, { status: 400 });
        const enseignants = await getEcoleEnseignants(client.id, ecoleId, anneeScolaire.id);
        return NextResponse.json({anneescolaire : anneeScolaire, enseignants : enseignants}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Liste des enseignants d'une école pour une année scolaire",(new URL(request.url)).pathname, error.message, false);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
