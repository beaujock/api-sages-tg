import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/ALL_USAGE/UtilitiesFactory";
import { getClientUserRouteRequestInfos} from "@/lib/auth";
import { exportSalleClassesPdf, getClientCurrentAnneeScolaire, getSalleClasseOverviews } from "@/factories/ADMIN_CLIENT/clientFactory";



export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        const anneeScolaire = await getClientCurrentAnneeScolaire(client.id);
        if (anneeScolaire === null ) return NextResponse.json({message : "Année scolaire manquant"}, { status: 400 });

        const clientSalleClasses = await getSalleClasseOverviews(client.id, anneeScolaire.id);
        const pdf = exportSalleClassesPdf(client, anneeScolaire, clientSalleClasses);
        return new Response(pdf, {
            status : 200,
            headers : {
                "Content-Type" : "application/pdf",
                "Content-Disposition" : `attachment; filename="classes-${client.code}.pdf"`
            }
        });
    }
    catch(error:any) {
        logError('F',"Echec : Export PDF de la liste des classes du client",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
