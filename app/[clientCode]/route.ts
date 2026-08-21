import { getClientOverview } from "@/factories/clientFactory";
import { registerNewClient} from "@/factories/onboardingFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, { params }: { params: Promise<{clientId:string }> }) {
    try {
        const clientId = (await params).clientId;
        if(!clientId) return NextResponse.json("Requête invalide (identification du client)", { status: 400 });
        const body = await request.json();
        const anneeScolaireId = body.anneeScolaireId;
        if(!anneeScolaireId) return NextResponse.json("Requête invalide (pas d'année scolaire)", { status: 400 });
        const clientOverview = await getClientOverview(clientId, anneeScolaireId);
        //if (createdNewClient.includes("ERROR")) return NextResponse.json({registerClientErrorMessage : createdNewClient}, { status: 400 });
        return NextResponse.json({clientOverview : clientOverview}, { status: 200 });
    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}