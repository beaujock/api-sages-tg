export type OverviewEleveDO = {
    id                      : string;
    eleve_label             : string;
    ecole_id                : string;
    ecole_label             : string;
    annee_scolaire_id       : string;
    annee_scolaire_label    : string;
    salle_classe_id         : string;
    salle_classe_label      : string;
    number_evaluations      : number;
    number_absences         : number;
    number_bulletins        : number;
}

export type OverviewEnseignantDO = {
    id                      : string;
    enseignant_label        : string;
    ecole_id                : string;
    ecole_label             : string;
    annee_scolaire_id       : string;
    annee_scolaire_label    : string;
    number_salles_classes   : number;
    number_matieres         : number;
    number_evaluations      : number;
    number_absences         : number;
    number_bulletins        : number;
}