import { confirmOnboardingRequestCode } from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const requestId = searchParams.get('requestID');
        if(!requestId) return NextResponse.json("Requête invalide", { status: 400 });
        const requestCode = searchParams.get('requestCODE');
        if(!requestCode) return NextResponse.json("Requête invalide", { status: 400 });
        const requestConfirmationMessage = await confirmOnboardingRequestCode(requestId, requestCode);
        return NextResponse.json({confirmationMessage : requestConfirmationMessage}); 
    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}