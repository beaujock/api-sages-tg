import { addNewClientSchool} from "@/factories/onboardingFactory";
import { logError } from "@/factories/utilitiesFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId:string, onboardingId: string, clientId:string, schoolId:string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const onboardingId = (await params).onboardingId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification de l'integration)", { status: 400 });
        const clientId = (await params).clientId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification du client)", { status: 400 });
        const schoolId = (await params).schoolId;
        if(!schoolId) return NextResponse.json("Requête invalide (identification de l'ecole)", { status: 400 });
        const addNewSchoolToClient = await addNewClientSchool(requestId,onboardingId, clientId, schoolId);
        if (addNewSchoolToClient.includes("ERROR")) return NextResponse.json({addNewSchoolToClientErrorMessage : addNewSchoolToClient}, { status: 400 });
        return NextResponse.json({addNewSchoolToClientSuccessMessage : addNewSchoolToClient}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Ajout du client au portfolio du client non enregistré",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}