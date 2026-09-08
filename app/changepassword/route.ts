import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { changeUserPassword } from "@/factories/userFactory";
import { getConnectedUser } from "@/lib/auth";

export async function POST(request:NextRequest) {
    try {
        //request.headers.set("Access-Control-Allow-Origin", "*");
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const changeRequest = {
            userId      : body.userId,
            newPassword : body.newPassword,
            changer     : body.changer
        };
        if (!changeRequest.userId || !changeRequest.newPassword || !changeRequest.changer || changeRequest.userId === null  || 
            changeRequest.newPassword === null || changeRequest.changer === null) 
            return NextResponse.json("Informations de connexion manquantes", { status: 400 });
        const user = await getConnectedUser(request);
        if (!user || user === null) return NextResponse.json("Utilisateur non connecté", { status: 401 });
        const updateUser = await changeUserPassword(user.id, changeRequest.newPassword, user.email);
        if (!updateUser || updateUser===null) return NextResponse.json("Changement de mot de passe non effectué", { status: 404 });
         return NextResponse.json({ message: "Succès : changement de mot de passe réussie réussie"}, { status: 200 });
    }
    catch(error:any){
        logError('F',"Changement de mot de passe non effectué",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}