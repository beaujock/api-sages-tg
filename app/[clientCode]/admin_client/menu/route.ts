import { getClientRoleMenuItems } from "@/factories/clientFactory";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode:string }> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json("Requête invalide (identification du code client)", { status: 400 });
        const userClientRoleMenuItems = await getClientRoleMenuItems(clientCode, "ADMIN_CLIENT");
        return NextResponse.json({menuItems : userClientRoleMenuItems}, { status: 200 });
    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}