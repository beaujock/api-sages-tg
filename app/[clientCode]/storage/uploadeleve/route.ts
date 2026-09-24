import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser } from "@/lib/auth";
import { getAllGenders } from "@/factories/ALL_USAGE/SagesTgFactory";
import { uploadElevePhoto } from "@/factories/ALL_USAGE/allUsageFactories";


export async function POST(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const user = await getConnectedUser(request);
        if (!user || user === null) return NextResponse.json({message : "Aucun utilisateur connecté"}, { status: 400 });
        const isPhotoUploaded = await uploadElevePhoto(body);
        return NextResponse.json({isPhotoUploaded : isPhotoUploaded}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Télécharger la photo d'un élève",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}