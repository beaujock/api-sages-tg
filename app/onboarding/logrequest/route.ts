import { createRequestForOnboarding, updateOnboardingRequestCode } from "@/factories/onboardingFactory";
import { generateCode, sendEmail } from "@/factories/utilitiesFactory";
import { SGSCreateRequestDO } from "@/types/ONBOARDING/onboardingTypes";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request : NextRequest) {
    try {
        const body = await request.json();
        if (!body || body===null) return NextResponse.json({message: "Requête invalide"}, { status: 400 });
        const requestToLog:SGSCreateRequestDO = {
            status                 : body.status,
            request_date           : body.request_date,
            request_code           : body.request_code,
            request_confirmed      : body.request_confirmed,
            requester_full_name    : body.requester_full_name,
            requester_email        : body.requester_email,
            requester_phone        : body.requester_phone,
            client_full_name       : body.client_full_name,
            client_code            : body.client_code,
            ecole_name             : body.ecole_name,
            ecole_code             : body.ecole_code,
            notes                  : body.notes,
            create_date            : body.create_date,
            created_by             : body.created_by
        };
        if ( requestToLog.status===null || requestToLog.request_date===null || requestToLog.request_confirmed===null || requestToLog.requester_full_name===null || 
            requestToLog.requester_email===null || requestToLog.ecole_name===null || requestToLog.create_date===null || requestToLog.created_by===null || 
            requestToLog.client_full_name===null || requestToLog.client_code===null)
              return NextResponse.json({message:"Requête invalide (données manquantes)"}, { status: 400 });
        requestToLog.request_date = new Date(requestToLog.request_date);
        requestToLog.create_date = new Date(requestToLog.create_date);
        const requestCode = await generateCode(6);
        console.log("Generated code is : ", requestCode);
        requestToLog.request_code = requestCode;
        const requestCreated = await createRequestForOnboarding(requestToLog);
        if (!requestCreated) return NextResponse.json({message:"Echec lors de la création de la requête"}, { status: 400 });
        //const requestCode = await generateCode(6);
        //const urlConfirmRequest = process.env.CONFIRM_REQUEST_URL +"?requestID=" + requestCreated.id + "&requestCODE=" + requestCode;
        await sendEmail({
            name : "Sages de Beaujock",
            email : requestToLog.requester_email,
            message : "Requête bien reçue.\nVotre code est : " + requestCode 
            //"Utilisez le lien ci dessous pour confirmez votre requête.\n" + urlConfirmRequest
        });
        //await updateOnboardingRequestCode(requestCreated.id, requestCode);

        return NextResponse.json({requete : requestCreated}, { status: 200 });
    }
    catch(error : any) {
        return NextResponse.json({message : error.message}, { status: 500 });
    }
}
