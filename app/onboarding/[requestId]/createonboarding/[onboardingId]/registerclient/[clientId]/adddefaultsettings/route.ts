import { addNewClientDefaultSettings} from "@/factories/onboardingFactory";
import { logError } from "@/factories/utilitiesFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId:string, onboardingId: string, clientId:string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const onboardingId = (await params).onboardingId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification de l'integration)", { status: 400 });
        const clientId = (await params).clientId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification du client)", { status: 400 });
        const addNewClientSettings = await addNewClientDefaultSettings(requestId, onboardingId, clientId);
        if (addNewClientSettings.includes("ERROR")) return NextResponse.json({addClientDefaultSettingsErrorMessage : addNewClientSettings}, { status: 400 });
        return NextResponse.json({addClientDefaultSettingsSuccessMessage : addNewClientSettings}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Paramétrages du client par défaut non enregistrée",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}