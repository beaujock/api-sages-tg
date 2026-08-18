import { sgs_client, sgs_ecole, sgs_enseignant, sgs_salle_classe } from "@/lib/generated/prisma/client";

export type AdminClientClientOverview = {
    client              : sgs_client,
    numberEcoles        : number,
    numberSalleClasses  : number,
    numberEnseignants   : number,
    numberEleves        : number
}

export type AdminClientClientDisplay = {
    id                       : string,
    systeme_scolaire_id      : string,
    active                   : boolean,
    status                   : string,
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

export function ToAdminClientClientDisplay(client:sgs_client) : AdminClientClientDisplay {
    return {
        id                       : client.id,
        systeme_scolaire_id      : client.systeme_scolaire_id,
        active                   : client.active,
        status                   : client.status,
        legal_name               : client.legal_name,
        short_name               : client.short_name,
        code                     : client.code,
        address                  : client.address,
        website                  : client.website,
        main_contact_name        : client.main_contact_name,
        main_contact_email       : client.main_contact_email,
        main_contact_phone       : client.main_contact_phone,
        other_contact_infos      : client.other_contact_infos,
        notes                    : client.notes,
        create_date              : client.create_date,
        created_by               : client.created_by,
        change_date              : client.change_date,
        changed_by               : client.changed_by
    }
}

export type AdminClientEcoleOverview = {
    ecole               : sgs_ecole,
    numberEcoles        : number,
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
    annee_scolaire_id        : string,
    classe_id                : string,
    code                     : string,
    description              : string|null,
    notes                    : string|null,
    create_date              : Date,
    created_by               : string,
    change_date              : Date|null,
    changed_by               : string|null
}

export function ToAdminClientSalleClasseDisplay(salleClasse:sgs_salle_classe) : AdminClientSalleClasseDisplay {
    return {
        id                       : salleClasse.id,
        ecole_id                 : salleClasse.ecole_id,
        annee_scolaire_id        : salleClasse.annee_scolaire_id,
        classe_id                : salleClasse.classe_id,
        code                     : salleClasse.code,
        description              : salleClasse.description,
        notes                    : salleClasse.notes,
        create_date              : salleClasse.create_date,
        created_by               : salleClasse.created_by,
        change_date              : salleClasse.change_date,
        changed_by               : salleClasse.changed_by
    }
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


