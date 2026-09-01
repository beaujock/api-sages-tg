import { sgs_client, sgs_ecole, sgs_enseignant, sgs_salle_classe, sgs_eleve, sgs_user } from "@/lib/generated/prisma/client";

export type AdminClientClientOverview = {
    client              : sgs_client|null,
    numberEcoles        : number,
    numberSalleClasses  : number,
    numberEnseignants   : number,
    numberEleves        : number
}

export type AdminClientClientDisplay = {
    id                       : string,
    systeme_scolaire_id      : string,
    systeme_scolaire_label   : string,
    active                   : boolean,
    active_label             : string,
    status                   : string,
    status_label             : string,
    legal_name               : string,
    short_name               : string|null,
    code                     : string,
    address                  : string|null,
    website                  : string|null,
    main_contact_name        : string|null,
    main_contact_email       : string|null,
    main_contact_phone       : string|null,
    other_contact_infos      : string|null,
    notes                    : string|null
    create_date              : Date,
    created_by               : string,
    change_date              : Date|null,
    changed_by               : string|null,
}

export type AdminClientEcoleOverview = {
    ecole               : sgs_ecole,
    numberSalleClasses  : number,
    numberEnseignants   : number,
    numberEleves        : number
}

export type AdminClientEcoleDisplay = {
    id                      : string,
    full_name               : string,
    short_name              : string|null,
    establishment_date      : Date|null;
    code                    : string,
    primary_contact_name    : string|null,
    secondary_contact_name  : string|null,
    contact_infos           : string|null,
    phone_number            : string|null,
    email                   : string|null,
    website                 : string|null,
    notes                   : string|null,
    create_date             : Date,
    created_by              : string,
    change_date             : Date|null,
    changed_by              : string|null
};

export function ToAdminClientEcoleDisplay(ecole:sgs_ecole) : AdminClientEcoleDisplay {
    return {
        id                      : ecole.id,
        full_name               : ecole.full_name,
        short_name              : ecole.short_name,
        establishment_date      : ecole.establishment_date,
        code                    : ecole.code,
        primary_contact_name    : ecole.primary_contact_name,
        secondary_contact_name  : ecole.secondary_contact_name,
        contact_infos           : ecole.contact_infos,
        phone_number            : ecole.phone_number,
        email                   : ecole.email,
        website                 : ecole.website,
        notes                   : ecole.notes,
        create_date             : ecole.create_date,
        created_by              : ecole.created_by,
        change_date             : ecole.change_date,
        changed_by              : ecole.changed_by
    }
}

export type AdminClientSalleClasseOverview = {
    salleClasse             : sgs_salle_classe,
    numberEnseignants       : number,
    numberEleves            : number
}

export type AdminClientSalleClasseDisplay = {
    id                       : string,
    ecole_id                 : string,
    ecole_label              : string,
    annee_scolaire_id        : string,
    annee_scolaire_label     : string,
    classe_id                : string,
    classe_label             : string,
    code                     : string,
    description              : string|null,
    notes                    : string|null,
    create_date              : Date,
    created_by               : string,
    change_date              : Date|null,
    changed_by               : string|null
}


export type AdminClientEnseignantOverview = {
    enseignant              : sgs_enseignant,
    numberClasses           : number,
}

export type AdminClientEnseignantDisplay = {
    id                       : string,
    matricule                : string,
    last_name                : string,
    first_name               : string,
    other_names              : string|null,
    preferred_name           : string|null,
    date_of_birth            : Date,
    gender                   : string,
    phone_number             : string|null,
    email                    : string|null,
    notes                    : string|null,
    create_date              : Date,
    created_by               : string,
    change_date              : Date|null,
    changed_by               : string|null
}

export function ToAdminClientEnseignantDisplay(enseignant:sgs_enseignant) : AdminClientEnseignantDisplay {
    return {
        id                       : enseignant.id,
        matricule                : enseignant.matricule,
        last_name                : enseignant.last_name,
        first_name               : enseignant.first_name,
        other_names              : enseignant.other_names,
        preferred_name           : enseignant.preferred_name,
        date_of_birth            : enseignant.date_of_birth,
        gender                   : enseignant.gender,
        phone_number             : enseignant.phone_number,
        email                    : enseignant.email,
        notes                    : enseignant.notes,
        create_date              : enseignant.create_date,
        created_by               : enseignant.created_by,
        change_date              : enseignant.change_date,
        changed_by               : enseignant.changed_by
    }
}

export type AdminClientUserDisplay = {
    id                       : string,
    username                 : string,
    email                    : string,
    full_name                : string,
    phone_number             : string|null,
    create_date              : Date,
    created_by               : string,
    change_date              : Date|null,
    changed_by               : string|null
}

export function ToAdminClientUserDisplay(user:sgs_user) : AdminClientUserDisplay {
    return {
        id                       : user.id,
        username                 : user.user_name,
        email                    : user.email,
        full_name                : user.full_name,
        phone_number             : user.phone,
        create_date              : user.create_date,
        created_by               : user.created_by,
        change_date              : user.change_date,
        changed_by               : user.changed_by
    }
}

export type AdminClientEleveOverview = {
    eleve              : sgs_eleve,
    numberClasses      : number,
}

export type AdminClientEleveDisplay = {
    id                       : string,
    matricule                : string,
    last_name                : string,
    first_name               : string,
    other_names              : string|null,
    preferred_name           : string|null,
    date_of_birth            : Date,
    gender                   : string,
    phone_number             : string|null,
    email                    : string|null,
    notes                    : string|null,
    create_date              : Date,
    created_by               : string,
    change_date              : Date|null,
    changed_by               : string|null
}

export function ToAdminClientEleveDisplay(enseignant:sgs_enseignant) : AdminClientEnseignantDisplay {
    return {
        id                       : enseignant.id,
        matricule                : enseignant.matricule,
        last_name                : enseignant.last_name,
        first_name               : enseignant.first_name,
        other_names              : enseignant.other_names,
        preferred_name           : enseignant.preferred_name,
        date_of_birth            : enseignant.date_of_birth,
        gender                   : enseignant.gender,
        phone_number             : enseignant.phone_number,
        email                    : enseignant.email,
        notes                    : enseignant.notes,
        create_date              : enseignant.create_date,
        created_by               : enseignant.created_by,
        change_date              : enseignant.change_date,
        changed_by               : enseignant.changed_by
    }
}

export type AdminClientUpdateEcoleRequest = {
    full_name               : string,
    short_name              : string|null,
    establishment_date      : Date|null,
    code                    : string,
    primary_contact_name    : string|null,
    secondary_contact_name  : string|null,
    contact_infos           : string|null,
    phone_number            : string|null,
    email                   : string|null,
    website                 : string|null,
    notes                   : string|null
}



