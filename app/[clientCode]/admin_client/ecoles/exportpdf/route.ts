import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser, userAndRouteAuthorized } from "@/lib/auth";
import { getClientByCode, getClientEcolesForPdfExport } from "@/factories/clientFactory";
import { getUserResources } from "@/factories/userFactory";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';



export async function GET(request:NextRequest, { params }: { params: Promise<{clientCode: string}> }) {
    try {
        const clientCode = (await params).clientCode;
        if(!clientCode) return NextResponse.json("Requête invalide (code client manquant)", { status: 400 });
        const client = await getClientByCode(clientCode);
        if (!client || client === null) return NextResponse.json({message : "Client inconnu"}, { status: 400 });
        const user = await getConnectedUser(request);
        if (user === null) return NextResponse.json({message : "Aucun utilisateur connecté"}, { status: 400 });
        const userAuthorized = await userAndRouteAuthorized(user, "ADMIN_CLIENT");
        if (!userAuthorized) return NextResponse.json({message : "Accès non authorisé (route)"}, { status: 400 });
        const userResources = await getUserResources(user.id);
        const clientIDs:string[] = [];
        userResources.forEach(resource => {
            if (resource.type_resource === "CLIENT") clientIDs.push(resource.resource_id);
        });
        if (!clientIDs.includes(client.id)) return NextResponse.json({message : "Accès non authorisé (client)"}, { status: 400 });
        //const clientEcoles = await getClientEcoles(client.id);
        const exportData = await getClientEcolesForPdfExport(client.id);
        const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 4. Add Title
    doc.setFontSize(18);
    // (text, x position, y position)
    doc.text(exportData.title, 14, 22); 

    // 5. Draw the Table
    autoTable(doc, {
      startY: 30, // Start drawing below the title
      head: [exportData.headers],
      body: exportData.data.map(row => [
        row.nom_ecole,
        row.code_ecole,
        row.total_classes,
        row.total_enseignants,
        row.total_eleves,
      ]),
      theme: 'grid',
      headStyles: { 
        fillColor: [0, 119, 145], // Uses your brand's teal-primary color (#007791)
        textColor: 255 
      },
    });

    // 6. Output the PDF as an ArrayBuffer
    const pdfArrayBuffer = doc.output('arraybuffer');

    // 7. Send standard Web API response to the frontend
    return new NextResponse(new Uint8Array(pdfArrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ecoles_statistiques.pdf"`,
      },
    });
    }
    catch(error:any) {
        logError('F',"Echec : Liste des écoles du client",(new URL(request.url)).pathname, error.message, true);
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}