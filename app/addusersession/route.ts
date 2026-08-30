import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { addUserSession, getUser, getUserClient, getUserResources, getUserRoles } from "@/factories/userFactory";
import { generateToken, verifyToken } from "@/lib/auth";
import { DecodedJwtToken } from "@/types/USERX/UserTypes";

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
        //const JWT_SECRET = process.env.JWT_SECRET || '';
        const decodedToken = await verifyToken(sessionRequest.token) as unknown as DecodedJwtToken;
        const sessionAdded:boolean = await addUserSession(decodedToken.user.id, sessionRequest.token, new Date(sessionRequest.token_effective_time), new Date(sessionRequest.token_expiry_time));
        return NextResponse.json({ message: "Succès : Session ajoutée", session_added : sessionAdded, token : sessionRequest.token, effective_date : sessionRequest.token_effective_time,  expiry_date : sessionRequest.token_expiry_time}, { status: 200 });
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}