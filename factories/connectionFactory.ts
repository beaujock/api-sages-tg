import { checkConnection } from "@/lib/SGSTGdbConnect";
import { SGSTGConnection } from "@/types/Connection/SGSTGConnection";

const ErrorOrigin = "connectionFactory - ";

export async function youAreConnected() : Promise<boolean> {
    const functionName = "youAreConnected - ";
    try {
        const connection:SGSTGConnection = await checkConnection();
        if(!connection.isConnected || !connection.client) return false;
        return true;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}