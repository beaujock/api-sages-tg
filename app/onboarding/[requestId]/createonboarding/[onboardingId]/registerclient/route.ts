import { registerNewClient} from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId:string, onboardingId: string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const onboardingId = (await params).onboardingId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification de l'integration)", { status: 400 });
        const createdNewClient = await registerNewClient(requestId, onboardingId);
        if (createdNewClient.includes("ERROR")) return NextResponse.json({registerClientErrorMessage : createdNewClient}, { status: 400 });
        return NextResponse.json({newClientId : createdNewClient}, { status: 200 });
    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}