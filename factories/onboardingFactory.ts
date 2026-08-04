import { sgs_onboarding } from "@/lib/generated/prisma/browser";
import { sgs_request } from "@/lib/generated/prisma/client";
import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { SGSCreateOnboardingDO, SGSCreateRequestDO } from "@/types/ONBOARDING/onboardingTypes";
import { sendEmail } from "./utilitiesFactory";

const ErrorOrigin = "onboardingFactory - ";

export async function getOnboardingRequestById(requestId:string) : Promise<sgs_request|null> {
    const functionName = "getOnboardingRequestById - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const request = await prisma.sgs_request.findUnique({
            where : {
                id : requestId
            }
        });
        return request
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getOnboardingById(onboardingId:string) : Promise<sgs_onboarding|null> {
    const functionName = "getOnboardingById - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const onboarding = await prisma.sgs_onboarding.findUnique({
            where : {
                id : onboardingId
            }
        });
        return onboarding;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function createRequestForOnboarding(requestData : SGSCreateRequestDO) : Promise<sgs_request|null> {
    const functionName = "createRequestForOnboarding - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const request = await prisma.sgs_request.create({
            data : {
                status                 : requestData.status,
                request_date           : requestData.request_date,
                request_code           : requestData.request_code,
                request_confirmed      : requestData.request_confirmed,
                requester_full_name    : requestData.requester_full_name,
                requester_email        : requestData.requester_email,
                requester_phone        : requestData.requester_phone,
                ecole_name             : requestData.ecole_name,
                ecole_code             : requestData.ecole_code,
                notes                  : requestData.notes,
                create_date            : requestData.create_date,
                created_by             : requestData.created_by
            }
        });
        return request;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function updateOnboardingRequestCode(requestId:string, code:string) {
    const functionName = "updateOnboardingRequestCode - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        await prisma.sgs_request.update({
            where : {
                id : requestId
            },
            data : {
                request_code : code
            }
        });
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function confirmOnboardingRequestCode(requestId:string, code:string) : Promise<string>{
    const functionName = "confirmOnboardingRequestCode - ";
    try {
        if (requestId===null || !requestId) return "INVALID_REQUEST";
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const request = await getOnboardingRequestById(requestId);
        if (request===null) return "REQUEST_NOT_FOUND";
        if (request.request_code !== code) return "INVALID_CODE";
        if (request.request_confirmed) return "ALREADY_CONFIRMED";
        await prisma.sgs_request.update({
            where : {
                id : requestId
            },
            data : {
                request_confirmed : true,
                status : 'E'
            }
        });
        return "CONFIRMED";
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message 
        });
        return "CONFIRMATION_ERROR";
    }
}

export async function createSagesOnboarding(requestId:string) : Promise<sgs_onboarding|null> {
    const functionName = "createRequestForOnboarding - ";
    try {

        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const request = await getOnboardingRequestById(requestId);
        if (!request || request===null) throw new Error("Requête non trouvée.");
        if (!request.request_confirmed || request.request_code ==='D') throw new Error("Requête non confirmée.");
        if (request.request_code === 'I') throw new Error("L'intégration à SAGES a déjà été complètée.");
        
        const onboarding = await prisma.sgs_onboarding.create({
            data : {
                request_id             : request.id,
                status                 : 'C',
                start_date_time        : new Date(Date.now()),
                end_date_time          : null,
                notes                  : "Début de l'intégration a SAGES\n",
                create_date            : new Date(Date.now()),
                created_by             : "SAGES_ADMIN"
            }
        });
        return onboarding;
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        return null;
    }
}

export async function createSagesOnboardingSteps(onboardingId:string, requestId:string) : Promise<boolean>{
    const functionName = "createSagesOnboardingStep1 - ";
    let stepOrder= 1;
    let stepName = "";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const request = await getOnboardingRequestById(requestId);
        if (!request || request===null) throw new Error("Requête non trouvée.");
        if (!request.request_confirmed || request.request_code ==='D') throw new Error("Requête non confirmée.");
        if (request.request_code === 'I') throw new Error("L'intégration à SAGES a déjà été complètée.");
        //Create Step1
        stepName = "Création du client";
        const step1 = await prisma.sgs_onboarding_step.create({
            data :  {
                onboarding_id       : onboardingId,
                status              : "A",
                name                : stepName,
                step_order          : stepOrder,
                code_to_run         : "INSERT INTO SGS_CLIENT(systeme_scolaire_id, legal_name, short_name, code, create_date, created_by) VALUES ({systeme_scolaire_id}, {legal_name}, {short_name},{code}, {create_date}, {created_by})",
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ADMIN"
            }
        });
        stepOrder++;
        stepName = "Ajouts de modules au client";
        const step2 = await prisma.sgs_onboarding_step.create({
            data :  {
                onboarding_id       : onboardingId,
                status              : "A",
                name                : stepName,
                step_order          : stepOrder,
                code_to_run         : "INSERT INTO SGS_CLIENT_MODULE(client_id, module_id, create_date, created_by) VALUES ({client_id}, {module_id}, {create_date}, {created_by})",
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ADMIN"
            }
        });
        stepOrder++;
        stepName = "Ajout de paramètres client";
        const step3 = await prisma.sgs_onboarding_step.create({
            data :  {
                onboarding_id       : onboardingId,
                status              : "A",
                name                : stepName,
                step_order          : stepOrder,
                code_to_run         : "INSERT INTO SGS_CLIENT_SETTING(client_id, create_date, created_by) VALUES ({client_id}, {create_date}, {created_by})",
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ADMIN"
            }
        });
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function createSagesOnboardingSteps22(onboardingId:string) {
    const functionName = "createRequestForOnboarding - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        //Create Step1
        const request = await prisma
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

/*
await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.mssage 
        });
*/