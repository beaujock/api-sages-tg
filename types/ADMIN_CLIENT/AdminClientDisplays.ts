import { logError } from "@/factories/utilitiesFactory";
import { sgs_salle_classe, tg_annee_scolaire } from "@/lib/generated/prisma/client";
import { prisma, verifyAndSetPrismaConnection } from "@/lib/prisma";
import { getYear } from "date-fns";

const ErrorOrigin = "AdminClientDisplays";

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

export type DisplayAnneeScolaireDO = {
    id             : string;
    start_date     : Date;
    end_date       : Date
    notes          : string|null;
    create_date    : Date;
    created_by     : string;
    change_date    : Date|null;       
    changed_by     : string|null;
}

/* Functions to get Data Objects from instances */

export async function ToDisplaySalleClasseDO(instance : sgs_salle_classe) : Promise<DisplaySalleClasseDO|null>
{
    const functionName = "ToDisplaySalleClasseDO";
    try {
            const isConnected = await verifyAndSetPrismaConnection();
            if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
            const sc = await prisma.sgs_salle_classe.findUnique({
                where : {
                    id : instance.id
                },
                include : {
                    tg_annee_scolaire : true,
                    sgs_ecole : true,
                    tg_classe : true,
                }
            });
            if(!sc) return null;
            return {
                id                       : instance.id,
                ecole_id                 : instance.ecole_id,
                ecole_label              : sc.sgs_ecole.short_name,
                annee_scolaire_id        : instance.annee_scolaire_id,
                annee_scolaire_label     : getYear(sc.tg_annee_scolaire.start_date).toString() + "-" + getYear(sc.tg_annee_scolaire.end_date).toString(),
                classe_id                : instance.classe_id,
                classe_label             : sc.tg_classe.short_name,
                code                     : instance.code,
                description              : instance.description,
                notes                    : instance.notes,
                create_date              : instance.create_date,
                created_by               : instance.created_by,
                change_date              : instance.change_date,
                changed_by               : instance.changed_by
            }
    }
    catch(error:any) {
        logError('F',"Echec : function description ",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export function ToDisplayAnneeScolaireDO(instance : tg_annee_scolaire) : DisplayAnneeScolaireDO {
    return {
        id             : instance.id,
        start_date     : instance.start_date,
        end_date       : instance.end_date,
        notes          : instance.notes,
        create_date    : instance.create_date,
        created_by     : instance.created_by,
        change_date    : instance.change_date,
        changed_by     : instance.changed_by
    }
}