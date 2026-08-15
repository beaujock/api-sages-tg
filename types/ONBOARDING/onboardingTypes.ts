import { sgs_onboarding_step } from "@/lib/generated/prisma/client";

export type SGSCreateRequestDO = {                    
    status                 : string;
    request_date           : Date;
    request_code           : string|null;
    request_confirmed      : boolean;
    requester_full_name    : string;
    requester_email        : string;
    requester_phone        : string|null;
    client_full_name       : string;
    client_code            : string;
    ecole_name             : string;
    ecole_code             : string;
    notes                  : string|null;
    create_date            : Date;
    created_by             : string;
}

export type SGSCreateOnboardingDO = {
    request_id                : string;
    status                    : string;
    start_date_time           : Date;
    end_date_time             : Date|null;
    notes                     : string|null;
    create_date               : Date;
    created_by                : string;               
}

export type OnboardingStepsInfos = {
    id              : string;
    status          : string;
    name            : string;
    step_order      : number;
    code_to_run     : string|null;
    start_date_time : Date|null;
    end_date_time   : Date|null;
    notes           : string|null;
}

export function ToOnboardingStepsInfos(step:sgs_onboarding_step) : OnboardingStepsInfos {
    return {
        id              : step.id,
        status          : step.status,
        name            : step.name,
        step_order      : step.step_order,
        code_to_run     : step.code_to_run,
        start_date_time : step.start_date_time,
        end_date_time   : step.end_date_time,
        notes           : step.notes
    }
}