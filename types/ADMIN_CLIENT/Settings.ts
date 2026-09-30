import { getAnneeScolaireById } from "@/factories/ALL_USAGE/SagesTgFactory";
import { sgs_client_setting } from "@/lib/generated/prisma/client";

export type ClientSettingsDO = {
    client_id                   : string;
    annee_scolaire_id           : string|null;
    annee_scolaire_label        : string|null;
    max_schools                 : number;
    max_admin_client_users      : number;
    max_admin_ecole_users       : number;
    max_admin_classroom_users   : number;
    max_teacher_users           : number;
    max_parent_users            : number;
    max_eleve_users             : number;      
}

export type ClientEcoleSettingsDO = {
    client_id                           : string;
    ecole_id                            : string;
    annee_scolaire_id                   : string;
    prescolaire_id                      : boolean;
    primaire                            : boolean;
    secondaire_premier_cycle            : boolean;
    secondaire_second_cycle_general     : boolean;
    secondaire_second_cycle_technique   : boolean;
    max_ecole_admins                    : number;
    max_classroom_admins                : number;
    max_teacher_users                   : number;
    max_parent_users                    : number;
    max_eleve_users                     : number; 
}

export async function ToClientSettingsDO(instance : sgs_client_setting) : Promise<ClientSettingsDO|null> {
    let anneescolairelabel = null;
    let anneescolaireId = null;
    if (instance.anneescolaire_id !== null) {
        const anneeScolaire = await getAnneeScolaireById(instance.anneescolaire_id);
        if (anneeScolaire !== null) {
            anneescolaireId = anneeScolaire.id;
            anneescolairelabel = anneeScolaire.label;
        }
    };
        
    return {
        client_id                   : instance.client_id,
        annee_scolaire_id           : anneescolaireId,
        annee_scolaire_label        : anneescolairelabel,
        max_schools                 : instance.max_schools,
        max_admin_client_users      : instance.max_admin_client_users,
        max_admin_ecole_users       : instance.max_admin_ecole_users,
        max_admin_classroom_users   : instance.max_admin_classroom_users,
        max_teacher_users           : instance.max_teacher_users,
        max_parent_users            : instance.max_parent_users,
        max_eleve_users             : instance.max_eleve_users
    }
}