import { confirmOnboardingRequestCode, createOnboarding, createOnboardingSteps, getOnboardingById } from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request:NextRequest, { params }: { params: Promise<{requestId: string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const body = await request.json();
        const requestCode = body.requestCode;
        if(!requestCode) return NextResponse.json("Requête invalide (pas de code)", { status: 400 });
        const requestConfirmationResult = await confirmOnboardingRequestCode(requestId, requestCode);
        if (requestConfirmationResult.includes("ERROR")) return NextResponse.json({confirmationMessage : requestConfirmationResult});
        const theRequest = await getOnboardingById(requestConfirmationResult);
        return NextResponse.json({confirmationMessage : requestConfirmationResult, request : theRequest});

        /*
        const createOnboardingResult = await createOnboarding(requestId);
        if (createOnboardingResult.includes("ERROR")) return NextResponse.json({confirmationMessage:requestConfirmationResult, onboardingMessage:createOnboardingResult}, { status: 400 });
        const createOnboardingStepsResult = await createOnboardingSteps(createOnboardingResult);
        if (createOnboardingStepsResult.includes("ERROR"))
            return NextResponse.json({confirmationMessage:requestConfirmationResult, onboardingId:createOnboardingResult, onboardingStepsMessage:createOnboardingStepsResult}, { status: 400 });
        return NextResponse.json({confirmationMessage:requestConfirmationResult, onboardingId:createOnboardingResult, onboardingStepsMessage:createOnboardingStepsResult}, { status: 400 });
        */

    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}