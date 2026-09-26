import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser } from "@/lib/auth";
import {getUserRoles } from "@/factories/userFactory";
import { getClientByCode } from "@/factories/ADMIN_CLIENT/clientFactory";

export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {

        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json({message : "Requête invalide (code client manquant)"}, { status: 400 });
        const client = await getClientByCode(clientCode.toLowerCase());
        if (!client || client=== null) return NextResponse.json({message : "client non connu"}, { status: 400 });
        const user = await getConnectedUser(request);

        if (!user || user=== null) return NextResponse.json({message : "Utilisateur non connu"}, { status: 400 });
        const userRoles = await getUserRoles(user.id);

        return NextResponse.json({"user_id" : user.id,  first_login : user.first_login, roles : userRoles}, 
            { status: 200 });
    }
    catch(error:any){
        logError('F',"Vérification de jeton",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
