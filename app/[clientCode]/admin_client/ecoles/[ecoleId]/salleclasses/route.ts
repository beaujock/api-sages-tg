import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser, userAndRouteAuthorized } from "@/lib/auth";
import { getClientAnneeScolaire, getClientByCode, getClientEcoleSalleclasses, getClientEcolesById } from "@/factories/clientFactory";
import { getUserResources } from "@/factories/userFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string, ecoleId: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        const ecoleId = (await params).ecoleId;
        if(!clientCode) return NextResponse.json("Requête invalide (code client manquant)", { status: 400 });
        if(!ecoleId) return NextResponse.json("Requête invalide (ID de l'école manquant)", { status: 400 });
        const client = await getClientByCode(clientCode);
        if (!client || client === null) return NextResponse.json({message : "Client inconnu"}, { status: 400 });
        const ecole = await getClientEcolesById(client.id, ecoleId);
        if (!ecole || ecole === null) return NextResponse.json({message : "Ecole inconnu"}, { status: 400 });
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
        const anneeScolaire = await getClientAnneeScolaire(client.id);
        if (anneeScolaire === null) return NextResponse.json({message : "Aucune année scolaire en cours. Contactez votre administrateur"}, { status: 400 });


        const salleclasses = await getClientEcoleSalleclasses(client.id, ecoleId);
        return NextResponse.json({ecole: ecole, salleClasses: salleclasses}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Liste des classes d'une ecole",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}