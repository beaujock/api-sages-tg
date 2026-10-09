import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { logError } from "../ALL_USAGE/UtilitiesFactory";
import { DisplayAnneeScolaireDO, DisplayClientDO, DisplayEcoleDO, DisplayEleveDO, DisplayEnseignantDO, DisplayInscriptionDO, DisplaySalleClasseDO, DisplayUserDO, ToDisplayClientDO, ToDisplayEcoleDO, ToDisplayUserDO } from "@/types/ADMIN_ECOLE/Display";
import { getAnneeScolaireById } from "../ALL_USAGE/SagesTgFactory";
import { getClientCurrentAnneeScolaire } from "../ADMIN_CLIENT/clientFactory";
const ErrorOrigin = "ADMIN_ECOLE : ecoleFactory";
const EcoleResourceType = "ECOLE";

//#region Retrieveing data

export async function getEcoleCurrentAnneeScolaire(clientId:string, ecoleId:string) : Promise<DisplayAnneeScolaireDO|null> {
   const functionName = "getEcoleCurrentAnneeScolaire"
  try {
          const isConnected = await verifyAndSetPrismaConnection();
          if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
          let anneeScolaire:DisplayAnneeScolaireDO|null = null;
          const anneeScolaireFromSetting = await prisma.sgs_client_ecole_setting.findFirst({
            where : {
                sgs_client_ecole : {
                    client_id : clientId,
                    ecole_id : ecoleId
                },
              annee_scolaire_id : {
                not : null
              }
            }
          });
          if (anneeScolaireFromSetting && anneeScolaireFromSetting.annee_scolaire_id !== null) {
            anneeScolaire = await getAnneeScolaireById(anneeScolaireFromSetting.annee_scolaire_id);
            if (anneeScolaire) return anneeScolaire;
          }
          // Annee scolaire not set in the client ecole setting, then get the client annee scolaire
          // (getClientCurrentAnneeScolaire already falls back to the annee scolaire containing the current date)
          return await getClientCurrentAnneeScolaire(clientId);
      }
      catch(error:any) {
        logError('F',"Echec : Retrouver l'année scolaire en cours",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
      }
}

export async function getClientById(clientId:string) : Promise<DisplayClientDO|null> {
    const functionName = "getClientById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const client = await prisma.sgs_client.findUnique({
            where : {
                id : clientId
            },
            include : {
                tg_systeme_scolaire : true,
                lkp_client_status : true
            }
        });
        if(!client) return null;
        return ToDisplayClientDO(client);
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver un client par son identifiant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getClientByCode(clientCode:string) : Promise<DisplayClientDO|null> {
    const functionName = "getClientByCode";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const client = await prisma.sgs_client.findUnique({
            where : {
                code : clientCode
            },
            include : {
                tg_systeme_scolaire : true,
                lkp_client_status : true
            }
        });
        if(!client) return null;
        return ToDisplayClientDO(client);
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver un client par son code",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEcoleById(clientId:string, ecoleId:string) : Promise<DisplayEcoleDO|null> {
    const functionName = "getEcoleById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const ecole = await prisma.sgs_ecole.findFirst({
            where : {
                id : ecoleId,
                sgs_client_ecole : {
                    some : {
                        client_id : clientId,
                        status : 'A',
                        active : true
                    }
                }
            }
        });
        if(!ecole) return null;
        return ToDisplayEcoleDO(ecole);
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver une école par son identifiant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getSalleClasseById(clientId:string, ecoleId:string, salleClasseId:string) : Promise<DisplaySalleClasseDO|null> {
    const functionName = "getSalleClasseById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const salleClasse = await prisma.sgs_salle_classe.findFirst({
            where : {
                id : salleClasseId,
                ecole_id : ecoleId,
                sgs_ecole : {
                    sgs_client_ecole : {
                        some : {
                            client_id : clientId,
                            status : 'A',
                            active : true
                        }
                    }
                }
            },
            include : {
                tg_annee_scolaire : true,
                tg_classe : true,
                sgs_ecole : true
            }
        });
        if(!salleClasse) return null;
        return {
            id                       : salleClasse.id,
            ecole_id                 : salleClasse.ecole_id,
            ecole_label              : salleClasse.sgs_ecole.short_name === null ? salleClasse.sgs_ecole.full_name : salleClasse.sgs_ecole.short_name,
            annee_scolaire_id        : salleClasse.annee_scolaire_id,
            annee_scolaire_label     : salleClasse.tg_annee_scolaire.label,
            classe_id                : salleClasse.classe_id,
            classe_label             : salleClasse.tg_classe.code,
            code                     : salleClasse.code,
            description              : salleClasse.description,
            notes                    : salleClasse.notes,
            create_date              : salleClasse.create_date,
            created_by               : salleClasse.created_by,
            change_date              : salleClasse.change_date,
            changed_by               : salleClasse.changed_by
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver une classe par son identifiant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getSalleClasseByCode(clientId:string, ecoleId:string, salleClasseCode:string) : Promise<DisplaySalleClasseDO|null> {
    const functionName = "getSalleClasseByCode";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const salleClasse = await prisma.sgs_salle_classe.findFirst({
            where : {
                code : salleClasseCode,
                ecole_id : ecoleId,
                sgs_ecole : {
                    sgs_client_ecole : {
                        some : {
                            client_id : clientId,
                            status : 'A',
                            active : true
                        }
                    }
                }
            },
            include : {
                tg_annee_scolaire : true,
                tg_classe : true,
                sgs_ecole : true
            },
            orderBy : {
                tg_annee_scolaire : {
                    start_date : 'desc'
                }
            }
        });
        if(!salleClasse) return null;
        return {
            id                       : salleClasse.id,
            ecole_id                 : salleClasse.ecole_id,
            ecole_label              : salleClasse.sgs_ecole.short_name === null ? salleClasse.sgs_ecole.full_name : salleClasse.sgs_ecole.short_name,
            annee_scolaire_id        : salleClasse.annee_scolaire_id,
            annee_scolaire_label     : salleClasse.tg_annee_scolaire.label,
            classe_id                : salleClasse.classe_id,
            classe_label             : salleClasse.tg_classe.code,
            code                     : salleClasse.code,
            description              : salleClasse.description,
            notes                    : salleClasse.notes,
            create_date              : salleClasse.create_date,
            created_by               : salleClasse.created_by,
            change_date              : salleClasse.change_date,
            changed_by               : salleClasse.changed_by
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver une classe par son code",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEleveById(clientId:string, ecoleId:string, eleveId:string) : Promise<DisplayEleveDO|null> {
    const functionName = "getEleveById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const eleve = await prisma.sgs_eleve.findFirst({
            where : {
                id : eleveId,
                sgs_inscription : {
                    some : {
                        sgs_salle_classe : {
                            ecole_id : ecoleId,
                            sgs_ecole : {
                                sgs_client_ecole : {
                                    some : {
                                        client_id : clientId,
                                        status : 'A',
                                        active : true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            include : {
                lkp_gender : true
            }
        });
        if(!eleve) return null;
        return {
            id              : eleve.id,
            matricule       : eleve.matricule,
            last_name       : eleve.last_name,
            first_name      : eleve.first_name,
            other_names     : eleve.other_names,
            preferred_name  : eleve.preferred_name,
            date_of_birth   : eleve.date_of_birth,
            gender          : eleve.gender,
            gender_label    : eleve.lkp_gender.display_value,
            phone_number    : eleve.phone_number,
            email           : eleve.email,
            notes           : eleve.notes,
            create_date     : eleve.create_date,
            created_by      : eleve.created_by,
            change_date     : eleve.change_date,
            changed_by      : eleve.changed_by
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver un élève par son identifiant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEleveByMatricule(clientId:string, ecoleId:string, matriculeCode:string) : Promise<DisplayEleveDO|null> {
    const functionName = "getEleveByMatricule";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const eleve = await prisma.sgs_eleve.findFirst({
            where : {
                matricule : matriculeCode,
                sgs_inscription : {
                    some : {
                        sgs_salle_classe : {
                            ecole_id : ecoleId,
                            sgs_ecole : {
                                sgs_client_ecole : {
                                    some : {
                                        client_id : clientId,
                                        status : 'A',
                                        active : true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            include : {
                lkp_gender : true
            }
        });
        if(!eleve) return null;
        return {
            id              : eleve.id,
            matricule       : eleve.matricule,
            last_name       : eleve.last_name,
            first_name      : eleve.first_name,
            other_names     : eleve.other_names,
            preferred_name  : eleve.preferred_name,
            date_of_birth   : eleve.date_of_birth,
            gender          : eleve.gender,
            gender_label    : eleve.lkp_gender.display_value,
            phone_number    : eleve.phone_number,
            email           : eleve.email,
            notes           : eleve.notes,
            create_date     : eleve.create_date,
            created_by      : eleve.created_by,
            change_date     : eleve.change_date,
            changed_by      : eleve.changed_by
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver un élève par son matricule",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getInscriptionById(clientId:string, ecoleId:string, inscriptionId:string) : Promise<DisplayInscriptionDO|null> {
    const functionName = "getInscriptionById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const inscription = await prisma.sgs_inscription.findFirst({
            where : {
                id : inscriptionId,
                sgs_salle_classe : {
                    ecole_id : ecoleId,
                    sgs_ecole : {
                        sgs_client_ecole : {
                            some : {
                                client_id : clientId,
                                status : 'A',
                                active : true
                            }
                        }
                    }
                }
            },
            include : {
                sgs_salle_classe : true,
                sgs_eleve : true,
                lkp_registration_status : true
            }
        });
        if(!inscription) return null;
        return {
            id                      : inscription.id,
            salle_classe_id         : inscription.salle_classe_id,
            salle_classe_label      : inscription.sgs_salle_classe.code,
            eleve_id                : inscription.eleve_id,
            eleve_label             : inscription.sgs_eleve.first_name + " " + inscription.sgs_eleve.last_name,
            registration_date       : inscription.registration_date,
            registration_status     : inscription.registration_status,
            registration_status_label : inscription.lkp_registration_status.display_value,
            status_notes            : inscription.status_notes,
            notes                   : inscription.notes,
            create_date             : inscription.create_date,
            created_by              : inscription.created_by,
            change_date             : inscription.change_date,
            changed_by              : inscription.changed_by
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver une inscription par son identifiant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEleveCurrentActiveInscription(clientId:string, ecoleId:string, eleveId:string) : Promise<DisplayInscriptionDO|null> {
    const functionName = "getEleveCurrentActiveInscription";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = await getEcoleCurrentAnneeScolaire(clientId, ecoleId);
        if (anneeScolaire === null) throw new Error("Aucune année scolaire en cours");
        const inscription = await prisma.sgs_inscription.findFirst({
            where : {
                eleve_id : eleveId,
                registration_status : "A",
                sgs_salle_classe : {
                    annee_scolaire_id : anneeScolaire.id,
                    ecole_id : ecoleId,
                    sgs_ecole : {
                        sgs_client_ecole : {
                            some : {
                                client_id : clientId,
                                status : 'A',
                                active : true
                            }
                        }
                    }
                }
            },
            include : {
                sgs_salle_classe : true,
                sgs_eleve : true,
                lkp_registration_status : true
            },
            orderBy : {
                registration_date : 'desc'
            }
        });
        if(!inscription) return null;
        return {
            id                      : inscription.id,
            salle_classe_id         : inscription.salle_classe_id,
            salle_classe_label      : inscription.sgs_salle_classe.code,
            eleve_id                : inscription.eleve_id,
            eleve_label             : inscription.sgs_eleve.first_name + " " + inscription.sgs_eleve.last_name,
            registration_date       : inscription.registration_date,
            registration_status     : inscription.registration_status,
            registration_status_label : inscription.lkp_registration_status.display_value,
            status_notes            : inscription.status_notes,
            notes                   : inscription.notes,
            create_date             : inscription.create_date,
            created_by              : inscription.created_by,
            change_date             : inscription.change_date,
            changed_by              : inscription.changed_by
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver l'inscription active d'un élève pour l'année scolaire en cours",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEnseignantById(clientId:string, ecoleId:string, enseignantId:string) : Promise<DisplayEnseignantDO|null> {
    const functionName = "getEnseignantById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const enseignant = await prisma.sgs_enseignant.findFirst({
            where : {
                id : enseignantId,
                sgs_portfolio_enseignant : {
                    some : {
                        sgs_salle_classe_matiere : {
                            sgs_salle_classe : {
                                ecole_id : ecoleId,
                                sgs_ecole : {
                                    sgs_client_ecole : {
                                        some : {
                                            client_id : clientId,
                                            status : 'A',
                                            active : true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            include : {
                lkp_gender : true
            }
        });
        if(!enseignant) return null;
        return {
            id              : enseignant.id,
            matricule       : enseignant.matricule,
            last_name       : enseignant.last_name,
            first_name      : enseignant.first_name,
            other_names     : enseignant.other_names,
            preferred_name  : enseignant.preferred_name,
            date_of_birth   : enseignant.date_of_birth,
            gender          : enseignant.gender,
            gender_label    : enseignant.lkp_gender.display_value,
            phone_number    : enseignant.phone_number,
            email           : enseignant.email,
            notes           : enseignant.notes,
            create_date     : enseignant.create_date,
            created_by      : enseignant.created_by,
            change_date     : enseignant.change_date,
            changed_by      : enseignant.changed_by
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver un enseignant par son identifiant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getSalleClasses(clientId:string, ecoleId:string) : Promise<DisplaySalleClasseDO[]> {
    const functionName = "getSalleClasses";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = await getEcoleCurrentAnneeScolaire(clientId, ecoleId);
        if (anneeScolaire === null) return [];
        const salleClasses = await prisma.sgs_salle_classe.findMany({
            where : {
                ecole_id : ecoleId,
                annee_scolaire_id : anneeScolaire.id,
                sgs_ecole : {
                    sgs_client_ecole : {
                        some : {
                            client_id : clientId,
                            status : 'A',
                            active : true
                        }
                    }
                }
            },
            include : {
                tg_annee_scolaire : true,
                tg_classe : true,
                sgs_ecole : true
            },
            orderBy : {
                code : 'asc'
            }
        });
        return salleClasses.map(salleClasse => ({
            id                       : salleClasse.id,
            ecole_id                 : salleClasse.ecole_id,
            ecole_label              : salleClasse.sgs_ecole.short_name === null ? salleClasse.sgs_ecole.full_name : salleClasse.sgs_ecole.short_name,
            annee_scolaire_id        : salleClasse.annee_scolaire_id,
            annee_scolaire_label     : salleClasse.tg_annee_scolaire.label,
            classe_id                : salleClasse.classe_id,
            classe_label             : salleClasse.tg_classe.code,
            code                     : salleClasse.code,
            description              : salleClasse.description,
            notes                    : salleClasse.notes,
            create_date              : salleClasse.create_date,
            created_by               : salleClasse.created_by,
            change_date              : salleClasse.change_date,
            changed_by               : salleClasse.changed_by
        }));
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes d'une école",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getActiveUsers(clientId:string, ecoleId:string) : Promise<DisplayUserDO[]> {
    const functionName = "getActiveUsers";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        // sgs_user_resource.resource_id has no relation to sgs_ecole, so check the school is in the client portfolio first
        const clientEcole = await prisma.sgs_client_ecole.findFirst({
            where : {
                client_id : clientId,
                ecole_id : ecoleId,
                status : 'A',
                active : true
            }
        });
        if (!clientEcole) return [];
        const ecoleUsers = await prisma.sgs_user.findMany({
            where : {
                sgs_client_user : {
                    some : {
                        client_id : clientId,
                        status : 'A'
                    }
                },
                sgs_user_resource : {
                    some : {
                        type_resource : EcoleResourceType,
                        resource_id : ecoleId,
                        status : 'A'
                    }
                }
            },
            orderBy : {
                full_name : 'asc'
            }
        });
        return ecoleUsers.map(user => ToDisplayUserDO(user));
    }
    catch(error:any) {
        logError('F',"Echec : Lister les utilisateurs actifs d'une école",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}



//#endregion
