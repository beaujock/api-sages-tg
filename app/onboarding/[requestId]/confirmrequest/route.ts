import { confirmOnboardingRequestCode, getRequestById, } from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId: string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const body = await request.json();
        const requestCode = body.requestCode;
        if(!requestCode) return NextResponse.json("Requête invalide (pas de code)", { status: 400 });
        const requestConfirmationResult = await confirmOnboardingRequestCode(requestId, requestCode);
        if (requestConfirmationResult.includes("ERROR")) return NextResponse.json({confirmationMessage : requestConfirmationResult}, { status: 400 });
        const theRequest = await getRequestById(requestConfirmationResult);
        return NextResponse.json({updatedRequest : theRequest}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Requête non conconfirmée",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}