import { getClientRoleMenuItems } from "@/factories/clientFactory";
import { logError } from "@/factories/utilitiesFactory";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode:string }> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json("Requête invalide (identification du code client)", { status: 400 });
        const userClientRoleMenuItems = await getClientRoleMenuItems(clientCode, "ADMIN_CLIENT");
        return NextResponse.json({menuItems : userClientRoleMenuItems}, { status: 200 });
    }
    catch(error:any) {
        logError('F',"Echec : Menu d'un utilisateur",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}