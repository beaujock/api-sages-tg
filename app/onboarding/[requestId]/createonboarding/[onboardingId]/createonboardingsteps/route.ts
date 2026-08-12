import { createOnboardingSteps} from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId:string, onboardingId: string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const onboardingId = (await params).onboardingId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification de l'integration)", { status: 400 });
        const createdOnboardingSteps = await createOnboardingSteps(onboardingId);
        if (createdOnboardingSteps.includes("ERROR")) return NextResponse.json({onboardingStepsErrorMessage : createdOnboardingSteps}, { status: 400 });
        return NextResponse.json({onboardingStepsMessage : createdOnboardingSteps}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Etapes de l'intégration non enregistrées",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}