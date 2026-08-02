import {SGSTGConnection} from "@/types/Connection/SGSTGConnection";
import {prisma} from "./client"

export async function checkConnection() : Promise<SGSTGConnection> {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return {
            isConnected: true,
            connectionMessage: "Vous êtes connecté. !",
            client: prisma
        }
    }
    catch (error:any) {
        return {
            isConnected: false,
            connectionMessage: "La tentative de connection a échoué" + error.message,
            client: null
        }
    }
}