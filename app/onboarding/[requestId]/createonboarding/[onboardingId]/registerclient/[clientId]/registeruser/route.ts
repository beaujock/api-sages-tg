import { addNewClientBaseModules, registerNewUser} from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId:string, onboardingId: string, clientId:string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const onboardingId = (await params).onboardingId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification de l'integration)", { status: 400 });
        const clientId = (await params).clientId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification du client)", { status: 400 });
        const addNewUser = await registerNewUser(requestId,onboardingId, clientId);
        if (addNewUser.includes("ERROR")) return NextResponse.json({registerNewUserErrorMessage : addNewUser}, { status: 400 });
        return NextResponse.json({registerNewUserSuccessMessage : addNewUser}, { status: 200 });
    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}