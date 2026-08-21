import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getClientMenuItemsByRole } from "@/factories/clientFactory";

export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode:string, roleCode: string }> }) {
    try {
        const { clientCode, roleCode } = await params;
        if (!roleCode || roleCode === null) 
            return NextResponse.json("Informations de rôle manquantes", { status: 400 });
        if (!clientCode || clientCode === null) 
            return NextResponse.json("Informations de client manquantes", { status: 400 });
        const menuItems = await getClientMenuItemsByRole(clientCode, roleCode);
        return NextResponse.json({menuItems: menuItems }, { status: 200 });
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}