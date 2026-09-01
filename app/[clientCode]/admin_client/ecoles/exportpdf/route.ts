import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/factories/utilitiesFactory";
import { getConnectedUser, userAndRouteAuthorized } from "@/lib/auth";
import { getClientByCode, getClientEcolesForPdfExport } from "@/factories/clientFactory";
import { getUserResources } from "@/factories/userFactory";
import PDFDocument from 'pdfkit-table';


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
        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        // Create a new PDF document
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const chunks: Buffer[] = [];

        // Collect data chunks as the PDF is generated
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // 4. Build the PDF Content
        // Add Title
        doc.fontSize(20).text(exportData.title, { align: 'center' });
        doc.moveDown(2);

        // Define the table structure
        const table = {
            headers: exportData.headers,
            // pdfkit-table expects an array of string arrays for the rows
            rows: exportData.data.map(row => [
            row.nom_ecole,
            row.code_ecole,
            row.total_classes.toString(),
            row.total_enseignants.toString(),
            row.total_eleves.toString(),
            ]),
        };

        // Draw the table
        doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
            prepareRow: () => doc.font("Helvetica").fontSize(10),
        });

        // Finalize the PDF
        doc.end();
        });

    // 5. Return the PDF buffer to the frontend as a downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
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