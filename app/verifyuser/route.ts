import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { verifyToken } from "@/lib/auth";
import { isWithinInterval } from 'date-fns';
import { SagesToken } from "@/types/ALL_USAGE/AllUsagesTypes";

export async function POST(request:NextRequest) {
    try {
        //request.headers.set("Access-Control-Allow-Origin", "*");
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const connectionToken = body.connectionToken;
        if (!connectionToken || connectionToken === null) return NextResponse.json({message: "Informations de connexion manquantes"}, { status: 400 });
        const decodedToken = await verifyToken(connectionToken);
        if (!decodedToken || decodedToken === null) return NextResponse.json({message: "Informations de connexion invalides"}, { status: 400 });
        const token = decodedToken as SagesToken;
        const effective_date = token.effective_date;
        const expiry_date = token.expiry_date;
        if (!isWithinInterval(new Date(), { start: effective_date, end: expiry_date })) 
            return NextResponse.json({message: "Session expirée"}, { status: 400 });

        return NextResponse.json({userId : token.user_id, userFullName : token.user_full_name, message : "Utilisateur vérifié"}, { status: 200 });
        
    }
    catch(error:any){
        logError('F',"Vérification de jeton",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
