export type DisplayClientDO = {
    id                      : string;
    systeme_scolaire_id     : string;
    systeme_scolaire_label  :string
    active                  : boolean;
    active_label            : string;
    status                  : string;
    status_label            : string;
    legal_name              : string;
    short_name              : string|null;
    code                    : string;
    address                 : string|null;
    website                 : string|null;
    main_contact_name       : string|null;
    main_contact_email      : string|null;
    main_contact_phone      : string|null;
    other_contact_infos     : string|null;
    notes                   : string|null;
    create_date             : Date;
    created_by              : string;
    change_date             : Date|null;       
    changed_by              : string|null;
}

export type DisplayEcoleDO = {
    id                      : string;
    full_name               : string;
    short_name              : string|null;
    establishment_date      : Date|null;
    code                    : string;
    primary_contact_name    : string|null;
    secondary_contact_name  : string|null;
    contact_infos           : string|null;
    phone_number            : string|null;
    email                   : string|null;
    website                 : string|null;
    notes                   : string|null;
    create_date             : Date;
    created_by              : string;
    change_date             : Date|null;
    changed_by              : string|null;
}

export type DisplaySalleClasseDO = {
    id                       : string;
    ecole_id                 : string;
    ecole_label              : string;
    annee_scolaire_id        : string;
    annee_scolaire_label     : string;
    classe_id                : string;
    classe_label             : string;
    code                     : string;
    description              : string|null;
    notes                    : string|null;
    create_date              : Date;
    created_by               : string;
    change_date              : Date|null;
    changed_by               : string|null;
}

export type DisplayEleveDO = {
    id              : string;
    matricule       : string;
    last_name       : string;
    first_name      : string;
    other_names     : string|null;
    preferred_name  : string|null;
    date_of_birth   : Date|null;
    gender          : string;
    gender_label    : string;
    phone_number    : string|null;
    email           : string|null;
    notes           : string|null;
    create_date     : Date;
    created_by      : string;
    change_date     : Date|null;
    changed_by      : string|null;
}

export type DisplayEnseignantDO = {
    id              : string;
    matricule       : string;
    last_name       : string;
    first_name      : string;
    other_names     : string|null;
    preferred_name  : string|null;
    date_of_birth   : Date|null;
    gender          : string;
    gender_label    : string;
    phone_number    : string|null;
    email           : string|null;
    notes           : string|null;
    create_date     : Date;
    created_by      : string;
    change_date     : Date|null;
    changed_by      : string|null;
}

export type DisplayInscriptionDO = {
    id                      : string;
    salle_classe_id         : string;
    salle_classe_label      : string;
    eleve_id                : string;
    eleve_label             : string;
    registration_date       : Date;
    registration_status     : string;
    registration_status_label : string;
    status_notes            : string|null;
    notes                   : string|null;
    create_date             : Date;
    created_by              : string;
    change_date             : Date|null;
    changed_by              : string|null;
}