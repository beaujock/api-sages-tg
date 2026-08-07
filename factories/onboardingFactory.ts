import { sgs_onboarding } from "@/lib/generated/prisma/client";
import { sgs_request } from "@/lib/generated/prisma/client";
import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { SGSCreateRequestDO } from "@/types/ONBOARDING/onboardingTypes";
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
                client_full_name       : requestData.client_full_name,
                client_code            : requestData.client_code,
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

export async function createOnboardingSteps(onboardingId:string) : Promise<string> {
    const functionName = "createOnboardingSteps - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const tgSteps = await prisma.tg_onboarding_steps.findMany();
        if (tgSteps.length === 0) return "ERROR_NO_STEPS_CREATED";
        for (const tgStep of tgSteps) {
            await prisma.sgs_onboarding_step.create({
                data : {
                    onboarding_id   : onboardingId,
                    name            : tgStep.main_name + "..." + tgStep.sub_name,
                    step_order      : tgStep.step_order,
                    create_date     : new Date(Date.now()),
                    created_by      : "SAGES_ONBOARDING"          
                }
            });
        }
        return "ONBOARDING_STEPS_CREATED";
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message 
        });
        return "ERROR_ONBOARDING_STEPS_CREATION_FATAL";
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
    //step 1
    try {
        if (requestId===null || !requestId) return "ERROR_INVALID_REQUEST";
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const request = await getOnboardingRequestById(requestId);
        if (request===null) return "ERROR_REQUEST_NOT_FOUND";
        if (request.request_code !== code) return "ERROR_INVALID_CODE";
        if (request.request_confirmed) return "ERROR_ALREADY_CONFIRMED";
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
        return "ERROR_CONFIRMATION_REQUEST_FATAL";
    }
}

export async function createOnboarding(requestId:string) : Promise<string> {
    const functionName = "createRequestForOnboarding - ";
    try {
        if (requestId===null || !requestId) return "ERROR_INVALID_REQUEST";
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const request = await getOnboardingRequestById(requestId);
        if (!request || request===null) return "ERROR_REQUEST_NOT_FOUND";
        if (!request.request_confirmed || request.request_code ==='D') return "ERROR_REQUEST_NOT_CONFIRMED";
        if (request.request_code === 'I') return "ERROR_CLIENT_ALREADY_ONBOARDED";
        
        const createdOnboarding = await prisma.sgs_onboarding.create({
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
        if (createdOnboarding === null) return "ERROR_CREATION_ONBOARDING";
        return createdOnboarding.id;
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        return "ERROR_CREATION_ONBOARDING_FATAL";
    }
}

export async function registerNewClient(requestId:string) : Promise<string> {
    //Step 1
    const functionName = "registerClient - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");

        const validRequest = await prisma.sgs_request.findUnique({
            where : {
                id                  : requestId,
                request_confirmed   : true,
                status              : 'E'
            }
        });
        if (!validRequest || validRequest===null) return "ERROR_REQUEST_NOT_VALID";

        //create the client
        const systemScolaireId = process.env.SYSTEM_SCOLAIRE_ID;
        if (systemScolaireId == null || (typeof systemScolaireId === 'string' && systemScolaireId.trim() === '')) return "SYSTEM_SCOLAIRE_NOT_FOUND";
        const newClient = await prisma.sgs_client.create({
            data : {
                systeme_scolaire_id     : systemScolaireId,
                legal_name              : validRequest.client_full_name,
                code                    : validRequest.client_code,
                create_date             : new Date(Date.now()),
                created_by              : "SAGES_ONBOARDING"
            }
        });
        if (!newClient || newClient===null) return "ERROR_CLIENT_CREATION";
        return newClient.id;
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        return "ERROR_CLIENT_CREATION_FATAL";
    }
}

export async function addNewClientSettings(clientId:string) : Promise<string> {
    const functionName = "addClientSettings - ";
    try{
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const createdClientSettings = await prisma.sgs_client_setting.create({
            data : {
                client_id           : clientId,
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ONBOARDING"
            }
        });
        if (!createdClientSettings || createdClientSettings===null) return "ERROR_CLIENT_SETTING_CREATION";
        return createdClientSettings.id;
    }
    catch(error:any){
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function addNewClientBaseModule(clientId:string, moduleId:string) : Promise<string> {
    const functionName = "addClientBaseModules - ";
    try{
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const createdClientModule = await prisma.sgs_client_module.create({
            data : {
                client_id           : clientId,
                module_id           : moduleId,
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ONBOARDING"
            }
        });
        if (!createdClientModule || createdClientModule===null) return "ERROR_CLIENT_MODULE_CREATION (" + moduleId + ")";
        return createdClientModule.id;
    }
    catch(error:any){
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function addModuleToNewClient(clientId:string, moduleId:string) : Promise<string> {
    const functionName = "addModuleToNewClient - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const clientModule = await prisma.sgs_client_module.create({
            data : {
                client_id   : clientId,
                module_id   : moduleId,
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ONBOARDING"
            }
        });
        if(clientModule===null) return "ERROR_CLIENT_MODUE_CREATION";
        return clientModule.id;
    }
    catch(error:any){
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function addNewClientDefaultSettings(clientId:string) : Promise<string> {
    const functionName = "addNewClientDefaultSettings - ";
    try {
         const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const clientSetting = await prisma.sgs_client_setting.create({
            data : {
                client_id : clientId,
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ONBOARDING"
            }
        });
        if (clientSetting===null) return "ERROR_CLIENT_MODULE_CREATION";
        return clientSetting.id;
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.mssage
        });
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function registerNewSchool(requestId:string) : Promise<string> {
    const functionName = "registerClient - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");

        const validRequest = await prisma.sgs_request.findUnique({
            where : {
                id                  : requestId,
                request_confirmed   : true,
                status              : 'E'
            }
        });
        if (!validRequest || validRequest===null) return "ERROR_REQUEST_NOT_VALID";
        if (validRequest.ecole_code ==='NEW_ECOLE') return "ERROR_INVALID_ECOLE_CODE";

        //create the school
        const newSchool = await prisma.sgs_ecole.create({
            data : {
                full_name               : validRequest.ecole_name,
                code                    : validRequest.ecole_code,
                create_date             : new Date(Date.now()),
                created_by              : "SAGES_ONBOARDING"
            }
        });
        if (!newSchool || newSchool===null) return "ERROR_CLIENT_CREATION";
        return newSchool.id;
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function addNewClientSchool(clientId:string, schoolId:string) : Promise<string> {
        const functionName = "addClientSchool - ";
    try{
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const createdClientSchool = await prisma.sgs_client_ecole.create({
            data : {
                client_id       : clientId,
                ecole_id        : schoolId,
                create_date     : new Date(Date.now()),
                created_by      : "SAGES_ONBOARDING"
            }
        });
        if (!createdClientSchool || createdClientSchool === null) return "ERROR_CLIENT_ECOLE_CREATION";
        return createdClientSchool.id;
    }
    catch(error:any){
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function registerNewUser(requestId:string) : Promise<string>{
    const functionName = "registerNewUser - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        //retrieve a confirmed and not completed request
        const validRequest = await prisma.sgs_request.findUnique({
            where : {
                id                  : requestId,
                request_confirmed   : true,
                status              : 'E'
            }
        });
        if (!validRequest || validRequest===null) return "ERROR_REQUEST_NOT_VALID";

        //create the user
        const newUser = await prisma.sgs_user.create({
            data : {
                user_name     : validRequest.requester_email,
                full_name     : validRequest.requester_full_name,
                email         : validRequest.requester_email,
                phone         : validRequest.requester_phone,
                create_date   : new Date(Date.now()),
                created_by    : "SAGES_ONBOARDING"
            }
        });
        if (!newUser || newUser===null) return "ERROR_USER_CREATION";
        return newUser.id;
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

/* 
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ONBOARDING"
*/

/*
export async function addNewClientDefaultSettings(clientId:string) : Promise<string> {
    const functionName = "addNewClientDefaultSettings - ";
    try {
         const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.mssage
        });
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}
*/