import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser, userAndRouteAuthorized } from "@/lib/auth";
import { getClientActiveUsers, getClientByCode, getClientEcoles, getClientModules } from "@/factories/clientFactory";
import { getUserResources } from "@/factories/userFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json("Requête invalide (code client manquant)", { status: 400 });
        const client = await getClientByCode(clientCode);
        if (!client || client === null) return NextResponse.json({message : "Client inconnu"}, { status: 400 });
        const user = await getConnectedUser(request);
        if (user === null) return NextResponse.json({message : "Aucun utilisateur connecté"}, { status: 400 });
        const userAuthorized = await userAndRouteAuthorized(request, "ADMIN_CLIENT");
        if (!userAuthorized) return NextResponse.json({message : "Accès non authorisé (route)"}, { status: 400 });
        const userResources = await getUserResources(user.id);
        const clientIDs:string[] = [];
        userResources.forEach(resource => {
            if (resource.type_resource === "CLIENT") clientIDs.push(resource.resource_id);
        });
        if (!clientIDs.includes(client.id)) return NextResponse.json({message : "Accès non authorisé (client)"}, { status: 400 });
        const clientEcoles = await getClientEcoles(client.id);
        const clientModules = await getClientModules(client.id);
        const clientActiveUsers = await getClientActiveUsers(client.id);
        return NextResponse.json({clientEcoles: clientEcoles, clientModules: clientModules, clientActiveUsers: clientActiveUsers}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Liste des écoles du client",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}