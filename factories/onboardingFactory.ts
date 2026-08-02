import { sgs_request } from "@/lib/generated/prisma/client";
import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { SGSCreateRequestDO } from "@/types/ONBOARDING/onboardingTypes";

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
        return request
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
        const request = await prisma.sgs_request.findUnique({
            where : {
                id :requestId
            }
        });
        if (request===null) return "REQUEST_NOT_FOUND";
        if (request.request_code !== code) return "INVALID_CODE";
        if (request.request_confirmed) return "ALREADY_CONFIRMED";
        await prisma.sgs_request.update({
            where : {
                id : requestId
            },
            data : {
                request_confirmed : true
            }
        });
        return "CONFIRMED";

    }
    catch(error:any) {
        throw new Error(ErrorOrigin + functionName + error.message);
    }
}