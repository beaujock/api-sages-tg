import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest) {
    try {
        const body = await request.json();
        if (!body || body===null) return NextResponse.json({message: "Requête invalide"}, { status: 400 });
        const requestId = body.re
    }
    catch(error:any){
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}