import { NextRequest, NextResponse } from "next/server";
import { generatePassword, logError } from "@/factories/ALL_USAGE/UtilitiesFactory";
import { getClientUserRouteRequestInfos } from "@/lib/auth";
import { getOverview } from "@/factories/ADMIN_CLIENT/clientFactory";
import { getEcoleOverview } from "@/factories/ADMIN_ECOLE/ecoleFactory";
import { prisma, verifyAndSetPrismaConnection } from "@/lib/prisma";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const generatedPassword = "ugimaD3d!";
        const saltRounds = Number(process.env.SALT_ROUNDS);
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);
        if (!hashedPassword) throw new Error("Echec création d'utilisateur");
        //Create user
        const createdUser = await prisma.sgs_user.create({
            data : {
                user_name   : "desflags",
                email       : "coachdamigu@gmail.com",
                full_name   : "Danny Desflags",
                phone       : "+7802933890", 
                pwd_hash    : hashedPassword,
                create_date : new Date(Date.now()),
                created_by  : "SGS-ADMIN"
            }
        });

        const newUserRole = await prisma.sgs_user_role.create({
            data : {
                user_id         : createdUser.id,
                role_id         : "fddb4043-b70f-4460-9775-9ed2a9a8198b",
                effective_date  : new Date(Date.now()),
                create_date     : new Date(Date.now()),
                created_by      : "SGS-ADMIN"
            }
        });

        const userResource = await prisma.sgs_user_resource.create({
            data : {
                user_id         : createdUser.id,
                type_resource   : "ECOLE",
                resource_id     : "b5b3b083-d710-47f8-b388-f7dafb18b025",
                create_date     : new Date(Date.now()),
                created_by      : "SGS-ADMIN"
            }
        });

        const userClient = await prisma.sgs_client_user.create({
            data : {
                client_id       : "9cdf143b-bec6-4bcd-a40f-cb1dba65cfc6",
                user_id         : createdUser.id,
                create_date     : new Date(Date.now()),
                created_by      : "SGS-ADMIN"
            }
        });
    }
    catch(error:any) {
        logError('F',"Echec : Administrateur école - Tableau de bord",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
