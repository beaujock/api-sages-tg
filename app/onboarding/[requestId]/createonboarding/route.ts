import { createOnboarding} from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId: string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const createdOnboarding = await createOnboarding(requestId);
        if (createdOnboarding.includes("ERROR")) return NextResponse.json({onboardingMessage : createdOnboarding});
        return NextResponse.json({onboardingId : createdOnboarding}, { status: 200 });
    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}