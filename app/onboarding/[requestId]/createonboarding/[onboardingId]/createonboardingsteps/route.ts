import { createOnboardingSteps} from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId:string, onboardingId: string }> }) {
    try {
        const onboardingId = (await params).onboardingId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification de l'integration)", { status: 400 });
        const createdOnboardingSteps = await createOnboardingSteps(onboardingId);
        if (createdOnboardingSteps.includes("ERROR")) return NextResponse.json({onboardingStepsErrorMessage : createdOnboardingSteps}, { status: 400 });
        return NextResponse.json({onboardingStepsMessage : createdOnboardingSteps}, { status: 200 });
    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}