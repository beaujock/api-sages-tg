import { PrismaClient } from "@/lib/generated/prisma/client";

export type SGSTGConnection = {
    isConnected : boolean;
    connectionMessage : string;
    client : PrismaClient | null;
}