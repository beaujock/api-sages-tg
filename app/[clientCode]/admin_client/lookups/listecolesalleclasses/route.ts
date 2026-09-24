import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import {  getClientEcoleSalleClasses } from "@/factories/clientFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const body = await request.json();
        if(!body || body.ecoleId === null) return NextResponse.json("Requête invalide", { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        const client = requestedRouteInfos.client;
        const clienEcoleSalleClasses = await getClientEcoleSalleClasses(client.id, body.ecoleId)
        return NextResponse.json({salleclasses: clienEcoleSalleClasses}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Classes d'une école",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}