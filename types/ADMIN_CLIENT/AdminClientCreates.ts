export type AdminClientCreateEcoleDO = {
    full_name              : string;
    short_name             : string;
    establishment_date     : Date|null;
    code                   : string;
    primary_contact_name   : string|null;
    secondary_contact_name : string|null;
    contact_infos          : string|null;
    phone_number           : string|null;
    email                  : string|null;
    website                : string|null;
    notes                  : string|null;
    created_by             : string;
}

export type AdminClientCreateSalleClasseDO = {
    ecole_id                 : string;
    classe_id                : string;
    code                     : string;
    description              : string|null;
    notes                    : string|null;
    created_by               : string;
}

export type AdminClientCreateEleveDO = {
    matricule       : string;
    last_name       : string;
    first_name      : string;
    other_names     : string|null;
    preferred_name  : string|null;
    date_of_birth   : Date;
    gender          : string;
    phone_number    : string|null;
    email           : string|null;
    notes           : string|null;
    created_by      : string;
}

export type AdminClientCreateInscriptionDO = {
    salle_classe_id         : string;
    eleve_id                : string;
    registration_date       : Date;
    registration_status     : string;
    status_notes            : string|null;
    notes                   : string|null;
    created_by              : string;
}