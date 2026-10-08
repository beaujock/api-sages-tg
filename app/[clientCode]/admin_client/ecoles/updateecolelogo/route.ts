import { NextRequest, NextResponse } from "next/server";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getEcoleLogoUrl, uploadEcoleLogo, logError } from "@/factories/ALL_USAGE/UtilitiesFactory";
import { getEcoleById } from "@/factories/ADMIN_CLIENT/clientFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const logoData = body.logoData;
        if(!logoData) return NextResponse.json("Requête invalide", { status: 400 });
        const requestedRouteInfos = await getClientUserRouteRequestInfos(request, clientCode, "ADMIN_CLIENT","CLIENT");
        if (requestedRouteInfos.client === null || requestedRouteInfos.user === null || !requestedRouteInfos.allowed || requestedRouteInfos.resources.length === 0)
            return NextResponse.json({message : requestedRouteInfos.message}, { status: 400 });
        
       const islogoUploaded = await uploadEcoleLogo(logoData);
        
        return NextResponse.json({islogoUploaded: islogoUploaded}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Liens (ecole)",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}