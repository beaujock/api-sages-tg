import { NextRequest, NextResponse } from "next/server";
import { generatePassword, logError } from "@/factories/ALL_USAGE/UtilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getOverview } from "@/factories/ADMIN_CLIENT/clientFactory";
import { getEcoleOverview } from "@/factories/ADMIN_ECOLE/ecoleFactory";
import { prisma, verifyAndSetPrismaConnection } from "@/lib/prisma";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_ECOLE","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        if (requestedRouteInfos.resources.length > 1) return NextResponse.json({message : "Requête invalide (plusieurs ressources ECOLE associées à cet utilisateur)"}, { status: 400 });
        //const client = requestedRouteInfos.client;
        const overview = await getEcoleOverview(requestedRouteInfos.resources[0]);
        if (!overview) return NextResponse.json({message : "Vue d'ensemble de l'école non disponible. Contactez votre administrateur"}, { status: 400 });
        return NextResponse.json({overview: overview}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Administrateur école - Tableau de bord",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
