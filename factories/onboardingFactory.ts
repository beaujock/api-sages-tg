import { sgs_client, sgs_onboarding } from "@/lib/generated/prisma/client";
import { sgs_request } from "@/lib/generated/prisma/client";
import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { SGSCreateRequestDO } from "@/types/ONBOARDING/onboardingTypes";
import { sendEmail } from "./utilitiesFactory";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ErrorOrigin = "onboardingFactory - ";

type Progress = {
    inProgress : boolean,
    requestNotes : string|null,
    onboardingNotes : string|null,
    message : string
}

export async function getRequestById(requestId:string) : Promise<sgs_request|null> {
    const functionName = "getRequestById - ";
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

export async function getClientById(clientId:string) : Promise<sgs_client|null> {
    const functionName = "getClientById - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const onboarding = await prisma.sgs_client.findUnique({
            where : {
                id : clientId
            }
        });
        return onboarding;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getOnboardingFromRequest(requestId:string) : Promise<sgs_onboarding[]> {
    const functionName = "getOnboardingById - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const onboardings = await prisma.sgs_onboarding.findMany({
            where : {
                request_id: requestId
            }
        });

        return onboardings;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getModuleByCode(moduleCode:string) : Promise<string> {
    const functionName = "getModuleByCode - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const module = await prisma.tg_module.findUnique({
            where : {
                code: moduleCode
            }
        });
        if (!module || module===null) return "ERROR_MODULE_NOT_FOUND"
        return module.id;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function getRequestAndOnboardingProgress(requestId:string, onboardingId:string) : Promise<Progress> {
    const functionName = "getRequestAndOnboardingProgress - "
    try {
        let message = "Request and onboarding in progress";
        let requestNotes = "";
        let onboardingNotes = "";
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        
        const theRequest = await getRequestById(requestId);
        if (!theRequest || theRequest===null) message =  "ERROR_INVALID_REQUEST";
        else {
            if (!theRequest.request_confirmed || theRequest.status === 'D') message =  "ERROR_REQUEST_NOT_CONFIRMED";
            if (theRequest.status === 'I') message =  "ERROR_REQUEST_INTEGRATED";
            if (theRequest.status !== 'E') message =  "ERROR_REQUEST_STATUS";
            requestNotes = (theRequest.notes === null)?(""):(theRequest.notes);

            const onboarding = await getOnboardingById(onboardingId);
            if (!onboarding || onboarding===null) message =  "ERROR_INVALID_ONBOARDING";
            else {
                if (onboarding.status === 'F') message =  "ERROR_ONBOARDING_ALREADY_COMPLETED";
                if (onboarding.status === 'C') message =  "ERROR_ONBOARDING_NOT_IN_PROGRESS";
                if (onboarding.status !== 'E') message =  "ERROR_ONBOARDING_STATUS";
                onboardingNotes = (onboarding.notes === null)?(""):(onboarding.notes);
            }
        };
        if (message.includes("ERROR")) return {inProgress : false, requestNotes : requestNotes, onboardingNotes : onboardingNotes, message : message};
        return {inProgress : true, requestNotes : requestNotes, onboardingNotes : onboardingNotes, message : message};

    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function isOnboardingStepsCreated(onboardingId:string) : Promise<boolean> {
    const functionName = "isOnboardingStepsCreated - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const steps = await prisma.sgs_onboarding_step.findMany({
            where : {
                onboarding_id : onboardingId
            }
        });
        if (steps.length === 0) return false;
        return true;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function createRequestForOnboarding(requestData : SGSCreateRequestDO) : Promise<sgs_request|null> {
    const functionName = "createRequestForOnboarding - ";
    //console.log("Entering function : createRequestForOnboarding");
    //console.log("Request Data : ", requestData);
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        console.log("Connected ?",isConnected);
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

export async function isRequestReadyForOnboarding(requestId:string) : Promise<boolean> {
    const functionName = "isRequestReadyForOnboarding - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const theRequest = await prisma.sgs_request.findUnique({
            where : {
                id : requestId,
                request_confirmed : true,
                status : 'E'
            }
        });
        if (theRequest === null) return false;
        return true;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function createOnboarding(requestId:string) : Promise<string> {
    const functionName = "createRequestForOnboarding - ";
    try {
        if (requestId===null || !requestId) return "ERROR_INVALID_REQUEST";
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");

        const confirmedRequest = await isRequestReadyForOnboarding(requestId);
        if (!confirmedRequest) return "ERROR_REQUEST_NOT_READY_FOR_ONBOARDING";
        const onboardingsFromRequest = await  getOnboardingFromRequest(requestId);
        if (onboardingsFromRequest.length>0) return "ERROR_REQUEST_HAS_ONBOARDING"
        const createdOnboarding = await prisma.sgs_onboarding.create({
            data : {
                request_id             : requestId,
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

export async function createOnboardingSteps(onboardingId:string) : Promise<string> {
    const functionName = "createOnboardingSteps - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const onboarding = await getOnboardingById(onboardingId);
        if (onboarding===null) return "ERROR_INVALID_ONBOARDING";
        if (onboarding.status === 'F') return "ERROR_COMPLETED_ONBOARDING";
        if (onboarding.status === 'E') return "ERROR_ONBOARDING_ALREADY_STARTED";
        const stepsCreated = await isOnboardingStepsCreated(onboardingId);
        if (stepsCreated) return "ERROR_ONBOARDING_STEPS_ALREADY_CREATED";
        const tgSteps = await prisma.tg_onboarding_steps.findMany();
        if (tgSteps.length === 0) return "ERROR_NO_STEPS_CREATED";
        let notes:string ="\nLes étapes de l'intégration\n";
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
            notes = notes + "Step : " + tgStep.step_order + " - " + tgStep.main_name + "..." + tgStep.sub_name + "\n";
        }
        const updatedNotes = onboarding.notes + notes;
        await prisma.sgs_onboarding.update({
                where : {
                    id : onboardingId
                },
                data : {
                    notes : updatedNotes,
                    status : 'E',
                    change_date : new Date(Date.now()),
                    changed_by : "SAGES_ONBOARDING" 
                }
            });
        return "ONBOARDING_STEPS_CREATED" + notes;
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
        const request = await getRequestById(requestId);
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
        return requestId;
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

export async function updateOnboardingStep(stepOrder:number, onboardingId:string, notes:string) : Promise<string> {
    const functionName = "updateOnboardingStep - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const step = await prisma.sgs_onboarding_step.findMany({
             where : {
                onboarding_id : onboardingId,
                step_order : stepOrder
            }
        });
        if (step.length === 0) return "ERROR_STEP_NOT_FOUND";
        if (step.length >1) return "ERROR_TOO_MANY_STEPS_FOUND";
        const updateStep = await prisma.sgs_onboarding_step.update({
            where : {
                id : step[0].id
            },
            data : {
                status          : 'C',
                change_date     : new Date(Date.now()),
                changed_by      : "SAGES_ONBOARDING"
            }
        });
        if (!updateStep || updateStep === null) return "ERROR_STEP_NOT_UPDATED";
        const today = new Date(Date.now());
        const updatedOnboarding = await prisma.sgs_onboarding.update({
            where : {
                id : onboardingId
            },
            data : {
                notes          : notes + "\n" + step[0].name + " =======> Complèté le " + format(today, "eeee d MMMM yyyy 'à' HH'h'mm", { locale: fr }),
                change_date     : today,
                changed_by      : "SAGES_ONBOARDING"
            }
        });
        if (!updatedOnboarding || updatedOnboarding === null) return "ERROR_ONBOARDING_NOTES_NOT_UPDATED";
        return "STEP_AND_ONBOARDING_UPDATED"
    }
    catch(error:any) {
        await sendEmail({
            name : "Erreur - Application SAGES-TG - " + ErrorOrigin + functionName,
            email : process.env.STMP_USER,
            message : "Voir détails de l'erreur ci-dessous\n\n" + error.message
        });
        return "ERROR_ONBOARDING_STEP_UPDATES_FATAL";
    }
}

export async function registerNewClient(requestId:string, onboardingId:string) : Promise<string> {
    //Step 1
    const functionName = "registerNewClient - ";
    try {
        const step = 1;
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        
        const theRequest = await getRequestById(requestId);
        if (!theRequest || theRequest===null) return "ERROR_INVALID_REQUEST";
        if (!theRequest.request_confirmed || theRequest.status === 'D') return "ERROR_REQUEST_NOT_CONFIRMED";
        if (theRequest.status === 'I') return "ERROR_REQUEST_INTEGRATED";
        if (theRequest.status !== 'E') return "ERROR_REQUEST_STATUS";

        const onboarding = await getOnboardingById(onboardingId);
        if (!onboarding || onboarding===null) return "ERROR_INVALID_ONBOARDING";
        if (onboarding.status === 'F') return "ERROR_ONBOARDING_ALREADY_COMPLETED";
        if (onboarding.status === 'C') return "ERROR_ONBOARDING_NOT_IN_PROGRESS";
        if (onboarding.status !== 'E') return "ERROR_ONBOARDING_STATUS";
        

        //create the client
        const systemScolaireId = process.env.SYSTEM_SCOLAIRE_ID;
        if (systemScolaireId == null || (typeof systemScolaireId === 'string' && systemScolaireId.trim() === '')) return "ERROR_SYSTEM_SCOLAIRE_NOT_FOUND";
        const newClient = await prisma.sgs_client.create({
            data : {
                systeme_scolaire_id     : systemScolaireId,
                legal_name              : theRequest.client_full_name,
                code                    : theRequest.client_code,
                create_date             : new Date(Date.now()),
                created_by              : "SAGES_ONBOARDING"
            }
        });
        if (!newClient || newClient===null) return "ERROR_CLIENT_CREATION";
        //update the step
        const today = new Date(Date.now());
        //const notes = onboarding.notes + "\nCréation du client .... Complètée .... Le " + format(today, "eeee d MMMM yyyy 'à' HH'h'mm", { locale: fr });
        const updateOnboardingAndStep = await updateOnboardingStep(1,onboarding.id,(onboarding.notes===null)?(""):(onboarding.notes));
        if (updateOnboardingAndStep.includes("ERROR")) return "ERROR_CLIENT_CREATED_ONBOARDING_STEP_NOT_UPDATED";
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

export async function isModuleAddedToClient(clientId:string, moduleId:string) : Promise<boolean> {
    const functionName = "isModuleAddedToClient - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const clientModules = await prisma.sgs_client_module.findMany({
            where : {
                client_id : clientId,
                module_id : moduleId
            }
        });
        if (clientModules.length === 0) return false;
        return true;
    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}

export async function addModuleToNewClient(onboardingId:string, clientId:string, moduleId:string, stepOrder:number) : Promise<string> {
    const functionName = "addModuleToClient - ";
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
        if(clientModule===null) return "ERROR_CLIENT_MODULE_CREATION";
        const onboarding = await getOnboardingById(onboardingId);
        if (!onboarding || onboarding===null) return "ERROR_CLIENT_MODULE_CREATED_ONBOARDING_NOT_FOUND";
        const updatedOnboardingStep = await updateOnboardingStep(stepOrder,onboarding.id,(onboarding.notes===null)?(""):(onboarding.notes));
        if (updatedOnboardingStep.includes("ERROR")) return "ERROR_CLIENT_MODULE_CREATED_ONBOARDING_STEP_NOT_UPDATED";
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

export async function addNewClientBaseModules(requestId:string, onboardingId:string,clientId:string) : Promise<string> {
    const functionName = "addNewClientBaseModules - ";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        
        const theRequest = await getRequestById(requestId);
        if (!theRequest || theRequest===null) return "ERROR_INVALID_REQUEST";
        if (!theRequest.request_confirmed || theRequest.status === 'D') return "ERROR_REQUEST_NOT_CONFIRMED";
        if (theRequest.status === 'I') return "ERROR_REQUEST_INTEGRATED";
        if (theRequest.status !== 'E') return "ERROR_REQUEST_STATUS";

        const onboarding = await getOnboardingById(onboardingId);
        if (!onboarding || onboarding===null) return "ERROR_INVALID_ONBOARDING";
        if (onboarding.status === 'F') return "ERROR_ONBOARDING_ALREADY_COMPLETED";
        if (onboarding.status === 'C') return "ERROR_ONBOARDING_NOT_IN_PROGRESS";
        if (onboarding.status !== 'E') return "ERROR_ONBOARDING_STATUS";

        const client = await getClientById(clientId);
        if (!client || client===null) return "ERROR_INVALID_CLIENT";

        //step 2 
        const userxModuleId = process.env.MODULE_USERX_ID!;
        const addUSERX = await addModuleToNewClient(onboardingId, client.id, userxModuleId, 2);
        if (addUSERX.includes("ERROR")) return "ERROR_USERX_MODULE_ADDED_ONBOARDING_STEP_NOT_UPDATED";

        //step 3
        const syscolModuleId = process.env.MODULE_SYSCOL_ID!;
        const addSYSCOL = await addModuleToNewClient(onboardingId, client.id, syscolModuleId, 3);
        if (addSYSCOL.includes("ERROR")) return "ERROR_SYSCOL_MODULE_ADDED_ONBOARDING_STEP_NOT_UPDATED";

        //step 4
        const soclasModuleId = process.env.MODULE_SOCLAS_ID!;
        const addSOCLAS = await addModuleToNewClient(onboardingId, client.id, soclasModuleId, 4);
        if (addSOCLAS.includes("ERROR")) return "ERROR_SOCLAS_MODULE_ADDED_ONBOARDING_STEP_NOT_UPDATED";
        return "ALL_BASE_MODULE_ADDED_AND_ONBOARDING_STEPS_UPDATED";
        
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

export async function addNewClientDefaultSettings(requestId:string, onboardingId:string,clientId:string) : Promise<string> {
    const functionName = "addNewClientDefaultSettings - ";
    try {
         const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const progress = await getRequestAndOnboardingProgress(requestId, onboardingId);
        if (!progress.inProgress) return progress.message;
        const clientSetting = await prisma.sgs_client_setting.create({
            data : {
                client_id : clientId,
                create_date         : new Date(Date.now()),
                created_by          : "SAGES_ONBOARDING"
            }
        });
        if (clientSetting===null) return "ERROR_CLIENT_DEFAULT_SETTINGS_CREATION";
        const updatedStep = await updateOnboardingStep(5,onboardingId,(progress.onboardingNotes === null)?(""):(progress.onboardingNotes ));
        if (updatedStep.includes("ERROR")) return "ERROR_CLIENT_DEFAULT_SETTINGS_ADDED_ONBOARDING_STEP_NOT_UPDATED";

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