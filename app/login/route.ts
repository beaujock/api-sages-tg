import { NextRequest, NextResponse } from "next/server";
import { logError, sendEmail } from "@/factories/utilitiesFactory";

const ErrorOrigin = "userFactory";

export async function POST(request:NextRequest) {
    try {
        //request.headers.set("Access-Control-Allow-Origin", "*");
        const body = await request.json();
        if(!body) return NextResponse.json("Requête invalide", { status: 400 });
        const loginRequest = {
            userName : body.userName,
            password : body.password
        };
        if (!loginRequest.userName || !loginRequest.password || 
            loginRequest.userName === null || loginRequest.password === null) 
            return NextResponse.json("Informations de connexion manquantes", { status: 400 });
        
        
        
    }
    catch(error:any){

    }
}