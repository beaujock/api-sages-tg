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