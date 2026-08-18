import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { logError } from "./utilitiesFactory";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AdminClientClientDisplay, AdminClientClientOverview, AdminClientEcoleDisplay, ToAdminClientClientDisplay, ToAdminClientEcoleDisplay } from "@/types/ADMIN_CLIENT/AdminClientTypes";
import { v_sgs_client } from "@/lib/generated/prisma/client";

const ErrorOrigin = "clientFactory";

export async function getClientViewById(clientId:string) : Promise<v_sgs_client|null> {
    const functionName = "getClientViewById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const v_clients = await prisma.v_sgs_client.findMany({
            where : {
                id : clientId
            }
        });
        if (v_clients.length === 0 || v_clients.length > 1) return null;
        return v_clients[0];

    }
    catch(error:any) {
        logError('F',"Obtenir un client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientById(clientId:string) : Promise<AdminClientClientDisplay|null> {
    const functionName = "getClientById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const client = await prisma.sgs_client.findUnique({
            where : {
                id : clientId
            }
        });
        if(!client) return null;
        return ToAdminClientClientDisplay(client);
    }
    catch(error:any) {
        logError('F',"Obtenir un client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientEcoles(clientId:string) : Promise<AdminClientEcoleDisplay[]> {
    const functionName = "getClientEcoles";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEcoles:AdminClientEcoleDisplay[] = [];
        const clientEcoles = await prisma.sgs_client_ecole.findMany({
            where : {
                client_id : clientId,
                status : 'A',
                active : true
            },
            include : {
                sgs_ecole : true
            }
        });
        clientEcoles.forEach(clienEcole => {
            listEcoles.push(ToAdminClientEcoleDisplay(clienEcole.sgs_ecole));
        });
        return [... new Set(listEcoles)];
    }
    catch(error:any) {
        logError('F',"Liste des écoles du client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

