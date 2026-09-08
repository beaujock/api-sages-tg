import { getUserConnectionInfos } from "@/factories/userFactory";
import { logError } from "@/factories/utilitiesFactory";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode:string, userId:string}> }) {
    try {
        const { clientCode, userId } = await params;
        if(!clientCode) return NextResponse.json("Requête invalide (identification du code client)", { status: 400 });
        const userInfos= await getUserConnectionInfos(clientCode, userId, "ADMIN_CLIENT");
        if (!userInfos || userInfos===null) return NextResponse.json({message: "Utilisateur non trouvé ou non autorisé"}, { status: 404 });
        return NextResponse.json({userInfos : userInfos}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Infos de connexion d'un utilisateur",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}