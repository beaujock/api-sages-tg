import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser } from "@/lib/auth";
import { getAllGenders } from "@/factories/ALL_USAGE/SagesTgFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const user = await getConnectedUser(request);
        if (!user || user === null) return NextResponse.json({message : "Aucun utilisateur connecté"}, { status: 400 });
        const genders = await getAllGenders()
        return NextResponse.json({genders : genders}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver tous les sexes",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}