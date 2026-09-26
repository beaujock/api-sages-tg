export type ClientSettingsDO = {
    client_id                   : string;
    annee_scolaire_id           : string;
    annee_scolaire_label        : string;
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