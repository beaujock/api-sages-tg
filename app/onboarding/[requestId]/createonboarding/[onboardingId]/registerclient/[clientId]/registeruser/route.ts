import { addNewClientBaseModules, getClientById, registerNewUser} from "@/factories/onboardingFactory";
import { sendEmail } from "@/factories/utilitiesFactory";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest, { params }: { params: Promise<{requestId:string, onboardingId: string, clientId:string }> }) {
    try {
        const requestId = (await params).requestId;
        if(!requestId) return NextResponse.json("Requête invalide (identification de la requête)", { status: 400 });
        const onboardingId = (await params).onboardingId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification de l'integration)", { status: 400 });
        const clientId = (await params).clientId;
        if(!onboardingId) return NextResponse.json("Requête invalide (identification du client)", { status: 400 });
        const addNewUser = await registerNewUser(requestId,onboardingId, clientId);
        const registerNewUserMessage = (typeof addNewUser === 'string')?(addNewUser):(addNewUser.message);
        const requesterEmail = (typeof addNewUser === 'string')?(null):(addNewUser.email);
        const clientName = (typeof addNewUser === 'string')?(null):(addNewUser.clientName);
        const schoolName = (typeof addNewUser === 'string')?(null):(addNewUser.schoolName);
        const password = (typeof addNewUser === 'string')?(null):(addNewUser.password);
        const message = (typeof addNewUser === 'string')?(null):(addNewUser.message);
        if (registerNewUserMessage.includes("ERROR")) return NextResponse.json({registerNewUserErrorMessage : addNewUser}, { status: 400 });
        if (requesterEmail === null)
            await sendEmail({
                    name : "Administrateur SAGES",
                    email : process.env.SMTP_USER!,
                    message : "Echech - Enregistrement du nouvel utilisateur (message ci dessous): " + addNewUser 
                    //"Utilisez le lien ci dessous pour confirmez votre requête.\n" + urlConfirmRequest
                });
        else
        {
            const client = await getClientById(clientId);
            if(!client || client === null) return NextResponse.json("Requête invalide (identification du client)", { status: 400 });
            await sendEmail({
                        name : "Administrateur SAGES",
                        email : requesterEmail,
                        message : "Félicitations.\nL'intégration a SAGES est complète. \nNom de client : " + clientName + "\nNom de l'école : " 
                        + schoolName + "\nVotre identifiant : " + requesterEmail + "\nVotre mot de passe temporaire : " + password +
                        "\nVeuillez vous connecter à l'application SAGES (encliquent sur le lien ci-dessous) et changer votre mot de passe.\n" +
                        "www.tg.sages.beaukock.com/" + client.code
                        //"Utilisez le lien ci dessous pour confirmez votre requête.\n" + urlConfirmRequest
                    });
        return NextResponse.json({registerNewUserSuccessMessage : message}, { status: 200 });
            }
    }
    catch(error:any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}