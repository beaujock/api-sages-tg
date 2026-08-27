import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { addUserSession, getUser, getUserClient, getUserResources, getUserRoles } from "@/factories/userFactory";
import { generateToken } from "@/lib/auth";

export async function POST(request:NextRequest) {
    try {
        //request.headers.set("Access-Control-Allow-Origin", "*");
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const sessionRequest = {
            token : body.token,
            token_effective_time : body.token_effective_time,
            token_expiry_time : body.token_expiry_time
        };
        if (sessionRequest.token === null) 
            return NextResponse.json("Informations de session manquantes", { status: 400 });
        const sessionAdded:boolean = await addUserSession(body.userId, sessionRequest.token, new Date(sessionRequest.token_effective_time), new Date(sessionRequest.token_expiry_time));
        return NextResponse.json({ message: "Succès : Session ajoutée", session_added : sessionAdded, token : sessionRequest.token, effective_date : sessionRequest.token_effective_time,  expiry_date : sessionRequest.token_expiry_time}, { status: 200 });
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}