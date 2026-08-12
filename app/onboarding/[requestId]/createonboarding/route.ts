import { createOnboarding} from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId: string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const createdOnboarding = await createOnboarding(requestId);
        if (createdOnboarding.includes("ERROR")) return NextResponse.json({onboardingMessage : createdOnboarding}, { status: 400 });
        return NextResponse.json({onboardingId : createdOnboarding}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Intégration non enregistrée",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}