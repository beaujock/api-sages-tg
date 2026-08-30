import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser, userAndRouteAuthorized } from "@/lib/auth";
import { getClientByCode, getClientSalleClasses } from "@/factories/clientFactory";
import { getUserResources } from "@/factories/userFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string, anneescolaireId:string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json("Requête invalide (code client manquant)", { status: 400 });
        const anneescolaireId = (await params).anneescolaireId;
        if(!anneescolaireId) return NextResponse.json("Requête invalide (année scolaire manquant)", { status: 400 });
        const client = await getClientByCode(clientCode);
        if (!client || client === null) return NextResponse.json({message : "Client inconnu"}, { status: 400 });
        const user = await getConnectedUser(request);
        if (user === null) return NextResponse.json({message : "Aucun utilisateur connecté"}, { status: 400 });
        const userAuthorized = await userAndRouteAuthorized(user, "ADMIN_CLIENT");
        if (!userAuthorized) return NextResponse.json({message : "Accès non authorisé (route)"}, { status: 400 });
        const userResources = await getUserResources(user.id);
        const clientIDs:string[] = [];
        userResources.forEach(resource => {
            if (resource.type_resource === "CLIENT") clientIDs.push(resource.resource_id);
        });
        if (!clientIDs.includes(client.id)) return NextResponse.json({message : "Accès non authorisé (client)"}, { status: 400 });
        const clientSalleClasses = await getClientSalleClasses(client.id, anneescolaireId);
        return NextResponse.json({clientSalleClasses: clientSalleClasses}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Liste des écoles du client",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}