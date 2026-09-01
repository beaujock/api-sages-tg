import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser, userAndRouteAuthorized } from "@/lib/auth";
import { getClientActiveUsers, getClientByCode, getClientEcoles, getClientModules } from "@/factories/clientFactory";
import { getUserResources } from "@/factories/userFactory";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        console.log("GET /admin_client/" + clientCode + " called");
        if(!clientCode) return NextResponse.json("Requête invalide (code client manquant)", { status: 400 });
        const client = await getClientByCode(clientCode.toUpperCase());
        console.log("Client : ", client);
        if (!client || client === null) return NextResponse.json({message : "Client inconnu"}, { status: 400 });
        const user = await getConnectedUser(request);
        console.log("User : ", user);
        if (user === null) return NextResponse.json({message : "Aucun utilisateur connecté"}, { status: 400 });
        const userAuthorized = await userAndRouteAuthorized(user, "ADMIN_CLIENT");
        console.log("User authorized : ", userAuthorized);
        if (!userAuthorized) return NextResponse.json({message : "Accès non authorisé (route)"}, { status: 400 });
        const userResources = await getUserResources(user.id);
        console.log("User resources : ", userResources);
        const clientIDs:string[] = [];
        userResources.forEach(resource => {
            if (resource.type_resource === "CLIENT") clientIDs.push(resource.resource_id);
        });
        if (!clientIDs.includes(client.id)) return NextResponse.json({message : "Accès non authorisé (client)"}, { status: 400 });
        const clientEcoles = await getClientEcoles(client.id);
        console.log("Client écoles : ", clientEcoles);
        const clientModules = await getClientModules(client.id);
        console.log("Client modules : ", clientModules);
        const clientActiveUsers = await getClientActiveUsers(client.id);
        console.log("Client active users : ", clientActiveUsers);
        return NextResponse.json({clientEcoles: clientEcoles, clientModules: clientModules, clientActiveUsers: clientActiveUsers}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Administrateur client - Tableau de bord",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}