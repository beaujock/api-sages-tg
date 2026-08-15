import { createOnboardingSteps, getOnboardingSteps} from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{requestId:string, onboardingId: string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const onboardingId = (await params).onboardingId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification de l'integration)", { status: 400 });
        const onboardingSteps = await getOnboardingSteps(requestId, onboardingId);
        if ((typeof(onboardingSteps)==="string") && onboardingSteps.includes("ERROR")) return NextResponse.json({stepsErrorMessage : onboardingSteps}, { status: 400 });
        return NextResponse.json({listSteps : onboardingSteps}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Liste des étapes de l'intégration",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}