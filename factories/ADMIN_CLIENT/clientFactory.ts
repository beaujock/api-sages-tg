import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { getYear } from 'date-fns';
import { generateMatricule, logError } from "../ALL_USAGE/allUsageFactories";
import { DisplayAnneeScolaireDO, DisplayClientDO, DisplayEcoleDO, DisplayEleveDO, DisplayEnseignantDO, DisplayInscriptionDO, DisplaySalleClasseDO, DisplayUserDO, ToDisplayAnneeScolaireDO, ToDisplayClientDO, ToDisplayEcoleDO, ToDisplayEleveDO, ToDisplaySalleClasseDO, ToDisplayUserDO } from "@/types/ADMIN_CLIENT/Displays";
import { OverviewDO, OverviewEcoleDO, OverviewSalleClasseDO, OverviewEleveDO, OverviewEnseignantDO } from "@/types/ADMIN_CLIENT/Overviews";
import { InfoClasseDO, InfoMatiereDO, InfoMenuItemLinkActionDO, InfoModuleDO} from "@/types/ALL_USAGE/AllUsagesTypes";
import { CreateEleveDO, CreateInscriptionDO, CreateSalleClasseDO } from "@/types/ADMIN_CLIENT/Creates";
import { getAnneeScolaireById, getEnseignementClasses, getRoleByCode } from "../ALL_USAGE/SagesTgFactory";
import { UpdateEcoleDO } from "@/types/ADMIN_CLIENT/Updates";
import { ClientSettingsDO, ToClientSettingsDO } from "@/types/ADMIN_CLIENT/Settings";
import { SagesMenuItem, ToSagesMenuItem } from "@/types/USERX/UserTypes";
const ErrorOrigin = "ADMIN_CLIENT : clientFactory";

/* Get DataObjects from records */



//#region Retrieveing data

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
                        client_id : clientId
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

export async function getEcoleSalleClasseById(clientId:string, ecoleId:string, salleClasseId:string) : Promise<DisplaySalleClasseDO|null> {
    const functionName = "getEcoleSalleClasseById";
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
                            client_id : clientId
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
            annee_scolaire_label     : getYear(salleClasse.tg_annee_scolaire.start_date).toString() + "-" + getYear(salleClasse.tg_annee_scolaire.end_date).toString(),
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

export async function getEcoleSalleClasseByCode(clientId:string, ecoleId:string, salleClasseCode:string) : Promise<DisplaySalleClasseDO|null> {
    const functionName = "getEcoleSalleClasseById";
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
                            client_id : clientId
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
            annee_scolaire_label     : getYear(salleClasse.tg_annee_scolaire.start_date).toString() + "-" + getYear(salleClasse.tg_annee_scolaire.end_date).toString(),
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



export async function getEleveById(clientId:string, eleveId:string) : Promise<DisplayEleveDO|null> {
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
                            sgs_ecole : {
                                sgs_client_ecole : {
                                    some : {
                                        client_id : clientId
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

export async function getEleveByMatricule(clientId:string, matriculeCode:string) : Promise<DisplayEleveDO|null> {
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
                            sgs_ecole : {
                                sgs_client_ecole : {
                                    some : {
                                        client_id : clientId
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

export async function getInscriptionById(clientId:string, inscriptionId:string) : Promise<DisplayInscriptionDO|null> {
    const functionName = "getInscriptionById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const inscription = await prisma.sgs_inscription.findFirst({
            where : {
                id : inscriptionId,
                sgs_salle_classe : {
                    sgs_ecole : {
                        sgs_client_ecole : {
                            some : {
                                client_id : clientId
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

export async function getEnseignantById(clientId:string, enseignantId:string) : Promise<DisplayEnseignantDO|null> {
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
                                sgs_ecole : {
                                    sgs_client_ecole : {
                                        some : {
                                            client_id : clientId
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
        logError('F',"Echec :Retrouver un enseignant par son identifiant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEcoles(clientId:string) : Promise<DisplayEcoleDO[]> {
    const functionName = "getEcoles";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEcoles:DisplayEcoleDO[] = [];
        const clientEcoles = await prisma.sgs_client_ecole.findMany({
            where : {
                client_id : clientId,
                status : 'A',
                active : true,
            },
            include : {
                sgs_ecole : true,
                sgs_client : true
            }
        });
        if(clientEcoles.length === 0) return [];
        for(const clientEcole of clientEcoles) {
            listEcoles.push(ToDisplayEcoleDO(clientEcole.sgs_ecole));
        }
        return [... new Set(listEcoles)];
    }
    catch(error:any) {
        logError('F',"Liste des écoles d'un client",ErrorOrigin + " : " + functionName, error.message, false);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getEcoleSalleClasses(clientId:string, ecoleId:string) : Promise<DisplaySalleClasseDO[]> {
    const functionName = "getEcoleSalleClasses";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listSallesClasses:DisplaySalleClasseDO[] = [];
        const anneeScolaire = await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire === null) return [];
        const salleClasses = await prisma.sgs_salle_classe.findMany({
            where : {
                ecole_id : ecoleId,
                annee_scolaire_id : anneeScolaire.id,
                sgs_ecole : {
                    sgs_client_ecole : {
                        some : {
                            client_id : clientId
                        }
                    }
                }
            }
        });
        for(const salleClasse of salleClasses) {
            const salleClasseDetails = await getEcoleSalleClasseById(clientId, ecoleId, salleClasse.id);
            if (salleClasseDetails) {
                listSallesClasses.push(salleClasseDetails);
            }
        }
        return [... new Set(listSallesClasses)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes d'une école d'un client ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getSalleClasses(clientId:string) : Promise<DisplaySalleClasseDO[]> {
    const functionName = "getSalleClasses";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        let listSallesClasses:DisplaySalleClasseDO[] = [];
        const anneeScolaire = await getClientCurrentAnneeScolaire(clientId);
        if(anneeScolaire === null) return [];
        const listEcoles = await getEcoles(clientId);
        if (listEcoles.length === 0) return [];
        for(const ecole of listEcoles) {
            const salleClasses = await getEcoleSalleClasses(clientId, ecole.id);
            listSallesClasses = [...listSallesClasses, ...salleClasses];
        }
        return [... new Set(listSallesClasses)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes d'un client ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}


export async function getSalleClasseEnseignants(clientId:string, salleclasseId:string) : Promise<DisplayEnseignantDO[]> {
    const functionName = "getSalleClasseEnseignants";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEnseignants:DisplayEnseignantDO[] = [];
        const portfolioEnseignants = await prisma.sgs_portfolio_enseignant.findMany({
            where : {
                sgs_salle_classe_matiere : {
                    salle_classe_id : salleclasseId,
                    sgs_salle_classe : {
                        sgs_ecole : {
                            sgs_client_ecole : {
                                some : {
                                    client_id : clientId
                                }
                            }
                        }
                    }
                }
            },
            include : {
                sgs_enseignant : true
            }
        });
        if (portfolioEnseignants.length === 0) return [];
        for (const portfolioEnseignant of portfolioEnseignants) {
            if (portfolioEnseignant.sgs_enseignant) {
                const enseignantDetails = await getEnseignantById(clientId, portfolioEnseignant.sgs_enseignant.id);
                if (enseignantDetails) {
                    listEnseignants.push(enseignantDetails);
                }
            }
        }
        return [...new Set(listEnseignants)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les enseignants d'une classe ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getEcoleEnseignants(clientId:string, ecoleId:string) : Promise<DisplayEnseignantDO[]> {
    const functionName = "getEcoleEnseignants";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEnseignants:DisplayEnseignantDO[] = [];
        const listClasses = await getEcoleSalleClasses(clientId, ecoleId);
        if (listClasses.length === 0) return [];
        for (const salleClasse of listClasses) {
            const enseignants = await getSalleClasseEnseignants(clientId, salleClasse.id);
            listEnseignants.push(...enseignants);
        }
        return [...new Set(listEnseignants)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les enseignants d'une école ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getEnseignants(clientId:string) : Promise<DisplayEnseignantDO[]> {
    const functionName = "getEnseignants";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEnseignants:DisplayEnseignantDO[] = [];
        const listEcoles = await getEcoles(clientId);
        if (listEcoles.length === 0) return [];
        for (const ecole of listEcoles) {
            const enseignants = await getEcoleEnseignants(clientId, ecole.id);
            listEnseignants.push(...enseignants);
        }
        return [...new Set(listEnseignants)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les enseignants d'un client ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getSalleClasseEleves(clientId:string, salleclasseId:string) : Promise<DisplayEleveDO[]> {
    const functionName = "getSalleClasseEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEleves:DisplayEleveDO[] = [];
        const inscriptions = await prisma.sgs_inscription.findMany({
            where : {
                salle_classe_id : salleclasseId,
                sgs_salle_classe : {
                    sgs_ecole : {
                        sgs_client_ecole : {
                            some : {
                                client_id : clientId
                            }
                        }
                    }
                }
            },
            include : {
                sgs_eleve : true
            }
        });
        for(const inscription of inscriptions) {
            if (inscription.sgs_eleve.id) {
                const eleveDetails = await getEleveById(clientId, inscription.sgs_eleve.id);
                if (eleveDetails) listEleves.push(eleveDetails);
            }
        }
        return [...new Set(listEleves)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les élèves d'une classe ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getEcoleEleves(clientId:string, ecoleId:string) : Promise<DisplayEleveDO[]> {
    const functionName = "getEcoleEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEleves:DisplayEleveDO[] = [];
        const listSalleclasses = await getEcoleSalleClasses(clientId, ecoleId);
        if(listSalleclasses.length === 0) return [];
        for (const salleclasse of listSalleclasses ) {
            const eleves = await getSalleClasseEleves(clientId, salleclasse.id);
            listEleves.push(...eleves);
        }
        return [...new Set(listEleves)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les élèves d'un école ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getEleves(clientId:string) : Promise<DisplayEleveDO[]> {
    const functionName = "getEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEleves:DisplayEleveDO[] = [];
        const listSalleclasses = await getSalleClasses(clientId);
        if(listSalleclasses.length === 0) return [];
        for (const salleclasse of listSalleclasses ) {
            const eleves = await getSalleClasseEleves(clientId, salleclasse.id);
            listEleves.push(...eleves);
        }
        return [...new Set(listEleves)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les élèves d'un client ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getEnseignantSalleClasses(clientId:string, ecoleId:string, anneeScolaireId:string, enseignantId:string) : Promise<DisplaySalleClasseDO[]> {
    const functionName = "getEnseignantSalleClasses";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listSallesClasses : DisplaySalleClasseDO[] = [];
        const salleClasses = await prisma.sgs_salle_classe_matiere.findMany({
            where : {
                sgs_portfolio_enseignant : {
                    some : {
                        enseignant_id : enseignantId
                    }
                },
                sgs_salle_classe : {
                    ecole_id : ecoleId,
                    annee_scolaire_id : anneeScolaireId,
                    sgs_ecole : {
                        sgs_client_ecole : {
                            some : {
                                client_id : clientId
                            }
                        }
                    }
                }
            },
            select : { salle_classe_id : true },
            distinct : ['salle_classe_id']
        });
        for(const salleClasse of salleClasses) {
            const salleClasseDetails = await getEcoleSalleClasseById(clientId, ecoleId, salleClasse.salle_classe_id);
            if (salleClasseDetails) {
                listSallesClasses.push(salleClasseDetails);
            }
        }
        return [... new Set(listSallesClasses)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes d'un enseignant ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getEnseignantMatieres(clientId:string, ecoleId:string, anneeScolaireId:string, enseignantId:string) : Promise<InfoMatiereDO[]> {
    const functionName = "getEnseignantMatieres";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listMatieres : InfoMatiereDO[] = [];
        const matieres = await prisma.sgs_salle_classe_matiere.findMany({
            where : {
                sgs_portfolio_enseignant : {
                    some : {
                        enseignant_id : enseignantId
                    }
                },
                sgs_salle_classe : {
                    ecole_id : ecoleId,
                    annee_scolaire_id : anneeScolaireId,
                    sgs_ecole :{
                        sgs_client_ecole : {
                            some : {
                                client_id : clientId
                            }
                        }
                    }
                }
            },
            include : {
                tg_matiere : true
            },
            distinct : ['matiere_id']
        });
        for(const matiere of matieres) {
            if (matiere.tg_matiere) {
                listMatieres.push({
                    id          : matiere.tg_matiere.id,
                    full_name   : matiere.tg_matiere.full_name,
                    short_name  : matiere.tg_matiere.short_name,
                    code        : matiere.tg_matiere.code
                });
            }
        }
        return [... new Set(listMatieres)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les matières d'un enseignant ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getEnseignantOverview(clientId:string, enseignantId:string) : Promise<OverviewEnseignantDO|null> {
    const functionName = "getEnseignantOverview";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire === null) throw new Error("Aucune année scolaire en cours");
        const portfolioEnseignants = await prisma.sgs_portfolio_enseignant.findMany({
            where : {
                enseignant_id : enseignantId,
                sgs_salle_classe_matiere : {
                    sgs_salle_classe : {
                        annee_scolaire_id : anneeScolaire.id,
                        sgs_ecole : {
                            sgs_client_ecole : {
                                some : {
                                    client_id : clientId
                                }
                            }
                        }
                    }
                }
            },
            include : {
                sgs_enseignant : true,
                sgs_salle_classe_matiere : {
                    include : {
                        sgs_salle_classe : true
                    }
                }
            }
        });
        if(portfolioEnseignants.length === 0) return null;
        const enseignant = portfolioEnseignants[0].sgs_enseignant;
        const ecoleIds = new Set(portfolioEnseignants.map(pe => pe.sgs_salle_classe_matiere.sgs_salle_classe.ecole_id));
        const salleClasseIds = new Set(portfolioEnseignants.map(pe => pe.sgs_salle_classe_matiere.salle_classe_id));
        const matiereIds = new Set(portfolioEnseignants.map(pe => pe.sgs_salle_classe_matiere.matiere_id));
        return {
            id                      : enseignant.id,
            enseignant_label        : enseignant.first_name + " " + enseignant.last_name,
            annee_scolaire_id       : anneeScolaire.id,
            annee_scolaire_label    : getYear(anneeScolaire.start_date).toString() + "-" + getYear(anneeScolaire.end_date).toString(),
            number_ecoles           : ecoleIds.size,
            number_salles_classes   : salleClasseIds.size,
            number_matieres         : matiereIds.size,
            number_evaluations      : 0, // to be calculated based on evaluations data
            number_absences         : 0, // to be calculated based on absences data
            number_bulletins        : 0 // to be calculated based on bulletins data
        }
    }
    catch(error:any) {
        logError('F',"Echec : Vue d'ensemble d'un enseignant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getMenuItemLinks(clientId:string, roleId:string, menuItemDisplay:string) : Promise<InfoMenuItemLinkActionDO[]>{
    const functionName = "getMenuItemLinks";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listLinks:InfoMenuItemLinkActionDO[] = [];
        const links = await prisma.sgs_client_module_role_menu_item_link.findMany({
            where : {
                active : true,
                sgs_client_module_role_menu_item : {
                    display_name : menuItemDisplay.toUpperCase(),
                    role_id : roleId,
                    sgs_client_module : {
                        client_id : clientId
                    }
                }
            },
            orderBy : {
                link_order : 'asc'
            }
        });
        for (const link of links) {
            listLinks.push({
                id : link.id,
                display_name : link.display_name,
                icon_name : link.icon_name,
                end_route : link.end_route,
                order : link.link_order,
                description : link.description
            });
        };
        return listLinks;
    }
    catch(error:any) {
        logError('F',"Echec : List des liens d'un menu", ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getMenuItemActions(clientId:string, roleId:string, menuItemDisplay:string) : Promise<InfoMenuItemLinkActionDO[]> {
    const functionName = "getMenuItemActions";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listActions:InfoMenuItemLinkActionDO[] = [];
        const actions = await prisma.sgs_client_module_role_menu_item_action.findMany({
            where : {
                active : true,
                sgs_client_module_role_menu_item : {
                    display_name : menuItemDisplay.toUpperCase(),
                    role_id : roleId,
                    sgs_client_module : {
                        client_id : clientId
                    }
                }
            },
            orderBy : {
                action_order : 'asc'
            }
        });
        for (const action of actions) {
            listActions.push({
                id : action.id,
                display_name : action.display_name,
                icon_name : action.icon_name,
                end_route : action.end_route,
                order : action.action_order,
                description : action.description
            });
        };
        return listActions;
    }
    catch(error:any) {
        logError('F',"Echec : List des actions d'un menu", ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getClientCurrentAnneeScolaire(clientId:string) : Promise<DisplayAnneeScolaireDO|null> {
   const functionName = "getClientCurrentAnneeScolaire"
  try {
          const isConnected = await verifyAndSetPrismaConnection();
          if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
          let anneeScolaire:DisplayAnneeScolaireDO|null = null;
          const anneeScolaireFromSetting = await prisma.sgs_client_setting.findFirst({
            where : {
              client_id : clientId,
              anneescolaire_id : {
                not : null
              }
            }
          });
          if (anneeScolaireFromSetting && anneeScolaireFromSetting.anneescolaire_id !== null) {
            anneeScolaire = await getAnneeScolaireById(anneeScolaireFromSetting.anneescolaire_id);
          }
          const currentDate = new Date();
          const currentAnneeScolaire = await prisma.tg_annee_scolaire.findFirst({
            where : {
              start_date : {
                lte : currentDate
              },
              end_date : {
                gte : currentDate
              }
            }
          });
          if (currentAnneeScolaire) anneeScolaire = ToDisplayAnneeScolaireDO(currentAnneeScolaire);
          return anneeScolaire;
      }
      catch(error:any) {
        logError('F',"Echec : Retrouver l'annéee scolaire en cours",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
      }
}

export async function getEcoleClassesAllowed(clientId:string, ecoleId:string) : Promise<InfoClasseDO[]> {
    const functionName = "getEcoleClassesAllowed";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        let  listClasses:InfoClasseDO[] = [];
        const clienEcoleSetting = await prisma.sgs_client_ecole_setting.findFirst({
            where : {
                sgs_client_ecole : {
                    client_id : clientId,
                    ecole_id : ecoleId
                }
            }
        });
        if (!clienEcoleSetting) return [];
        if(clienEcoleSetting.prescolaire) {
            const newClasses = await getEnseignementClasses(clienEcoleSetting.prescolaire);
            listClasses.push(...newClasses);
        };
        if(clienEcoleSetting.primaire) {
            const newClasses = await getEnseignementClasses(clienEcoleSetting.primaire);
            listClasses.push(...newClasses);
        };
        if(clienEcoleSetting.secondaire_premier_cycle) {
            const newClasses = await getEnseignementClasses(clienEcoleSetting.secondaire_premier_cycle);
            listClasses.push(...newClasses);
        };
        if(clienEcoleSetting.secondaire_second_cycle_general) {
            const newClasses = await getEnseignementClasses(clienEcoleSetting.secondaire_second_cycle_general);
            listClasses.push(...newClasses);
        };
        if(clienEcoleSetting.secondaire_second_cycle_technique) {
            const newClasses = await getEnseignementClasses(clienEcoleSetting.secondaire_second_cycle_technique);
            listClasses.push(...newClasses);
        };
        
        return listClasses;
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes autorisées d'une école ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getModules(clientId:string) : Promise<InfoModuleDO[]> {
    const functionName = "getModules";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listModules:InfoModuleDO[] = [];
        const clientModules = await prisma.sgs_client_module.findMany({
            where : {
                client_id : clientId
            },
            include : {
                tg_module : true
            }
        });
        if (!clientModules || clientModules.length === 0) return [];
        for (const cm of clientModules) {
            if (cm) listModules.push({
                id : cm.tg_module.id,
                full_name : cm.tg_module.full_name,
                short_name : cm.tg_module.short_name,
                code : cm.tg_module.code,
                order : cm.tg_module.module_order
            });
        };
        return listModules;
    }
    catch(error:any) {
        logError('F',"Echec : recherche des modules d'un client",ErrorOrigin + " : " + functionName, error.message, false);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getRoleMenuItems(clientId: string, roleCode:string) : Promise<SagesMenuItem[]> {
    const functionName = "getRoleMenuItems";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const menuItems:SagesMenuItem[] = [];
        const role = await getRoleByCode(roleCode.toUpperCase());
        if (role === null) return menuItems;
        const items = await prisma.sgs_client_module_role_menu_item.findMany({
            where : {
                active : true,
                role_id : role.id,
                sgs_client_module : {
                    client_id : clientId
                }
            },
            orderBy : {
                item_order : 'asc'
            }
        });
        items.forEach(item => {
            menuItems.push(ToSagesMenuItem(item));
        });
        return menuItems;
    }
    catch(error:any) {
        logError('F',"Liste des éléments de menu basé sur le client et le role",ErrorOrigin + " : " + functionName, error.message, true);
        return [];
    }
}

export async function getActiveUsers(clientId:string) : Promise<DisplayUserDO[]> {
    const functionName = "getActiveUsers";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listUsers:DisplayUserDO[] = [];
        const clientUsers= await prisma.sgs_user.findMany({
            where : {
                sgs_client_user : {
                    some: {
                        client_id : clientId,
                        status : 'A'
                    }
                }
            }
        });
        clientUsers.forEach(user => {
            listUsers.push(ToDisplayUserDO(user));
        });
        return listUsers;
    }
    catch(error:any) {
        logError('F',"Recherche des utilisateurs actifs du client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}
//#endregion Retrieveing data


//#region get settings
export async function getSettings(clientId:string) : Promise<ClientSettingsDO|null> {
    const functionName = "getSettings";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const clientSettings = await prisma.sgs_client_setting.findFirst({
            where : {
                client_id : clientId
            }
        });
        if (!clientSettings || clientSettings === null) return null;
        const anneeScolaire = await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire === null) return null;
        return {
            client_id                   : clientId,
            annee_scolaire_id           : anneeScolaire.id,
            annee_scolaire_label        : getYear(anneeScolaire.start_date).toString() + "-" + getYear(anneeScolaire.end_date).toString(),
            max_schools                 : clientSettings.max_schools,
            max_admin_client_users      : clientSettings.max_admin_client_users,
            max_admin_ecole_users       : clientSettings.max_admin_ecole_users,
            max_admin_classroom_users   : clientSettings.max_admin_classroom_users,
            max_teacher_users           : clientSettings.max_teacher_users,
            max_parent_users            : clientSettings.max_parent_users,
            max_eleve_users             : clientSettings.max_eleve_users
        }
    }
    catch(error:any) {
        logError('F',"Echec : Paramètres client",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}
//#endregion get settings


//#region Export PDFs
//#endregion Export PDFs

//#region building overviews

export async function getOverview(clientId:string, anneeScolaireId?:string) : Promise<OverviewDO|null> {
    const functionName = "getOverview";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = anneeScolaireId
            ? await getAnneeScolaireById(anneeScolaireId)
            : await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire === null) throw new Error(anneeScolaireId ? "Année scolaire introuvable" : "Aucune année scolaire en cours");
        const salleClasseFilter = {
            annee_scolaire_id : anneeScolaire.id,
            sgs_ecole : {
                sgs_client_ecole : {
                    some : {
                        client_id : clientId
                    }
                }
            }
        };
        const [numberEcoles, numberSallesClasses, numberInscriptions, numberModules] = await Promise.all([
            prisma.sgs_client_ecole.count({
                where : { client_id : clientId }
            }),
            prisma.sgs_salle_classe.count({
                where : salleClasseFilter
            }),
            prisma.sgs_inscription.count({
                where : {
                    sgs_salle_classe : salleClasseFilter
                }
            }),
            prisma.sgs_client_module.count({
                where : { client_id : clientId }
            })
        ]);
        return {
            id                          : clientId,
            annee_scolaire_id           : anneeScolaire.id,
            annee_scolaire_label        : getYear(anneeScolaire.start_date).toString() + "-" + getYear(anneeScolaire.end_date).toString(),
            number_ecoles              : numberEcoles,
            number_salle_classes        : numberSallesClasses,
            number_eleve_inscriptions   : numberInscriptions,
            number_modules              : numberModules
        }
    }
    catch(error:any) {
        logError('F',"Echec : Générer la vue d'ensemble d'un client",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEcoleOverview(clientId:string, ecoleId:string, anneeScolaireId?:string) : Promise<OverviewEcoleDO|null> {
    const functionName = "getEcoleOverview";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const ecole = await prisma.sgs_ecole.findFirst({
            where : {
                id : ecoleId,
                sgs_client_ecole : {
                    some : {
                        client_id : clientId
                    }
                }
            }
        });
        if (!ecole) return null;
        const anneeScolaire = anneeScolaireId
            ? await getAnneeScolaireById(anneeScolaireId)
            : await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire === null) throw new Error(anneeScolaireId ? "Année scolaire introuvable" : "Aucune année scolaire en cours");
        const salleClasseFilter = {
            ecole_id : ecoleId,
            annee_scolaire_id : anneeScolaire.id
        };
        const [numberSallesClasses, eleves] = await Promise.all([
            prisma.sgs_salle_classe.count({
                where : salleClasseFilter
            }),
            prisma.sgs_inscription.findMany({
                where : {
                    sgs_salle_classe : salleClasseFilter
                },
                select : { eleve_id : true },
                distinct : ['eleve_id']
            })
        ]);
        return {
            id                      : ecole.id,
            short_name              : ecole.short_name,
            code                    : ecole.code,
            annee_scolaire_id       : anneeScolaire.id,
            annee_scolaire_label    : getYear(anneeScolaire.start_date).toString() + "-" + getYear(anneeScolaire.end_date).toString(),
            number_salles_classes   : numberSallesClasses,
            number_eleves           : eleves.length
        }
    }
    catch(error:any) {
        logError('F',"Echec : Générer la vue d'ensemble d'une école",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getSalleClasseOverview(clientId:string, ecoleId:string, salleClasseId:string) : Promise<OverviewSalleClasseDO|null> {
    const functionName = "getSalleClasseOverview";
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
                            client_id : clientId
                        }
                    }
                }
            },
            include : {
                tg_annee_scolaire : true
            }
        });
        if (!salleClasse) return null;
        const eleves = await prisma.sgs_inscription.findMany({
            where : {
                salle_classe_id : salleClasseId
            },
            select : { eleve_id : true },
            distinct : ['eleve_id']
        });
        return {
            id                      : salleClasse.id,
            code                    : salleClasse.code,
            annee_scolaire_id       : salleClasse.annee_scolaire_id,
            annee_scolaire_label    : getYear(salleClasse.tg_annee_scolaire.start_date).toString() + "-" + getYear(salleClasse.tg_annee_scolaire.end_date).toString(),
            number_eleves           : eleves.length
        }
    }
    catch(error:any) {
        logError('F',"Echec : Générer la vue d'ensemble d'une classe",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEleveOverview(clientId:string, eleveId:string, anneeScolaireId?:string) : Promise<OverviewEleveDO|null> {
    const functionName = "getEleveOverview";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = anneeScolaireId
            ? await getAnneeScolaireById(anneeScolaireId)
            : await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire === null) throw new Error(anneeScolaireId ? "Année scolaire introuvable" : "Aucune année scolaire en cours");
        const inscription = await prisma.sgs_inscription.findFirst({
            where : {
                eleve_id : eleveId,
                sgs_salle_classe : {
                    annee_scolaire_id : anneeScolaire.id,
                    sgs_ecole : {
                        sgs_client_ecole : {
                            some : {
                                client_id : clientId
                            }
                        }
                    }
                },
            },
            include : {
                sgs_eleve : true,
                sgs_salle_classe : {
                    include : {
                        sgs_ecole : true,
                        tg_annee_scolaire : true
                    }
                }
            },
            orderBy : {
                registration_date : 'desc'
            }
        });
        if(!inscription) return null;
        const eleve = inscription.sgs_eleve;
        return {
            id                      : eleve.id,
            eleve_label             : eleve.first_name + " " + eleve.last_name,
            ecole_id                : inscription.sgs_salle_classe.ecole_id,
            ecole_label             : inscription.sgs_salle_classe.sgs_ecole.short_name === null ? inscription.sgs_salle_classe.sgs_ecole.full_name : inscription.sgs_salle_classe.sgs_ecole.short_name,
            annee_scolaire_id       : inscription.sgs_salle_classe.annee_scolaire_id,
            annee_scolaire_label    : getYear(inscription.sgs_salle_classe.tg_annee_scolaire.start_date).toString() + "-" + getYear(inscription.sgs_salle_classe.tg_annee_scolaire.end_date).toString(),
            salle_classe_id         : inscription.salle_classe_id,
            salle_classe_label      : inscription.sgs_salle_classe.code,
        }
        
    }
    catch(error:any) {
        logError('F',"Echec : Générer la vue d'ensemble d'un élève",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getEcolesOverviews(clientId:string, anneeScolaireId?:string) : Promise<OverviewEcoleDO[]> {
    const functionName = "getEcolesOverviews";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const ecoles = await getEcoles(clientId);
        if(ecoles.length === 0) return [];
        const ecoleOverviews = await Promise.all(ecoles.map(ecole => getEcoleOverview(clientId, ecole.id, anneeScolaireId)));
        return ecoleOverviews.filter((overview): overview is OverviewEcoleDO => overview !== null);
    }
    catch(error:any) {
        logError('F',"Echec : Générer les vues d'ensemble des écoles",ErrorOrigin + " : " + functionName, error.message, false);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getEcoleSalleClasseOverviews(clientId:string, ecoleId:string, anneeScolaireId?:string) : Promise<OverviewSalleClasseDO[]> {
    const functionName = "getEcoleSalleClasseOverviews";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = anneeScolaireId
            ? await getAnneeScolaireById(anneeScolaireId)
            : await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire === null) throw new Error(anneeScolaireId ? "Année scolaire introuvable" : "Aucune année scolaire en cours");
        const salleClasses = await prisma.sgs_salle_classe.findMany({
            where : {
                ecole_id : ecoleId,
                annee_scolaire_id : anneeScolaire.id,
                sgs_ecole : {
                    sgs_client_ecole : {
                        some : {
                            client_id : clientId
                        }
                    }
                }
            },
            select : { id : true },
            orderBy : { code : 'asc' }
        });
        if(salleClasses.length === 0) return [];
        const salleClasseOverviews = await Promise.all(salleClasses.map(salleClasse => getSalleClasseOverview(clientId, ecoleId, salleClasse.id)));
        return salleClasseOverviews.filter((overview): overview is OverviewSalleClasseDO => overview !== null);
    }
    catch(error:any) {
        logError('F',"Echec : Générer les vues d'ensemble des classes d'une école",ErrorOrigin + " : " + functionName, error.message, false);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getSalleClasseOverviews(clientId:string, anneeScolaireId?:string) : Promise<OverviewSalleClasseDO[]> {
    const functionName = "getSalleClasseOverviews";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = anneeScolaireId
            ? await getAnneeScolaireById(anneeScolaireId)
            : await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire === null) throw new Error(anneeScolaireId ? "Année scolaire introuvable" : "Aucune année scolaire en cours");
        const salleClasses = await prisma.sgs_salle_classe.findMany({
            where : {
                annee_scolaire_id : anneeScolaire.id,
                sgs_ecole : {
                    sgs_client_ecole : {
                        some : {
                            client_id : clientId
                        }
                    }
                }
            },
            select : { id : true, ecole_id : true },
            orderBy : [{ ecole_id : 'asc' }, { code : 'asc' }]
        });
        if(salleClasses.length === 0) return [];
        const salleClasseOverviews = await Promise.all(salleClasses.map(salleClasse => getSalleClasseOverview(clientId, salleClasse.ecole_id, salleClasse.id)));
        return salleClasseOverviews.filter((overview): overview is OverviewSalleClasseDO => overview !== null);
    }
    catch(error:any) {
        logError('F',"Echec : Générer les vues d'ensemble des classes du client",ErrorOrigin + " : " + functionName, error.message, false);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

//#endregion building overviews


//#region Creating records 

export async function createSalleClasse(clientId: string, data : CreateSalleClasseDO) : Promise<DisplaySalleClasseDO|null> {
    const functionName = "createSalleClasse";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = await getClientCurrentAnneeScolaire(clientId);
        if (anneeScolaire===null) throw new Error("Aucune année scolaire en cours");
        const salleClasseCreated = await prisma.sgs_salle_classe.create({
            data : {
                ecole_id                 : data.ecole_id,
                annee_scolaire_id        : anneeScolaire.id,
                classe_id                : data.classe_id,
                code                     : data.code.toUpperCase(),
                description              : data.description,
                notes                    : data.notes,
                create_date              : new Date(),
                created_by               : data.created_by
            }
        });
        if (!salleClasseCreated) return null;
        return ToDisplaySalleClasseDO(salleClasseCreated);
    }
    catch(error:any) {
        logError('F',"Echec : function description ",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function createInscription(clientId: string, inscriptionData : CreateInscriptionDO) : Promise<DisplayInscriptionDO|null> {
    const functionName = "createInscription";
    try {

            const isConnected = await verifyAndSetPrismaConnection();
            if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");

        const salleClasse = await prisma.sgs_salle_classe.findFirst({
            where : {
                id : inscriptionData.salle_classe_id,
                sgs_ecole : {
                    sgs_client_ecole : {
                        some : {
                            client_id : clientId
                        }
                    }
                }
            }
        });
        if (!salleClasse) throw new Error("Classe inconnue pour ce client");
        const inscription = await prisma.sgs_inscription.create({
            data : {
                salle_classe_id     : inscriptionData.salle_classe_id,
                eleve_id            : inscriptionData.eleve_id,
                registration_date   : inscriptionData.registration_date,
                registration_status : inscriptionData.registration_status,
                status_notes        : inscriptionData.status_notes,
                notes               : inscriptionData.notes,
                create_date         : new Date(),
                created_by          : inscriptionData.created_by
            },
            include : {
                sgs_salle_classe : true,
                sgs_eleve : true,
                lkp_registration_status : true
            }
        });
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
        logError('F',"Echec : Créer une inscription ",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function createEleve(clientId: string, eleveData : CreateEleveDO) : Promise<DisplayEleveDO|null> {
    const functionName = "createEleve";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        let eleve = null;
        let matricule = null;
        do {
            matricule = generateMatricule(new Date(), eleveData.first_name, eleveData.last_name);
            eleve = await prisma.sgs_eleve.findUnique({ where : { matricule : matricule } });
        } while (eleve !== null);

        const eleveCreated = await prisma.sgs_eleve.create({
            data : {
                matricule       : matricule,
                last_name       : eleveData.last_name,
                first_name      : eleveData.first_name,
                other_names     : eleveData.other_names,
                preferred_name  : eleveData.preferred_name,
                date_of_birth   : eleveData.date_of_birth,
                gender          : eleveData.gender,
                phone_number    : eleveData.phone_number,
                email           : eleveData.email,
                notes           : eleveData.notes,
                created_by      : eleveData.created_by,
                create_date     : new Date()
            }
        });
        return ToDisplayEleveDO(eleveCreated);
    }
    catch(error:any) {
        logError('F',"Echec : Créer un éleve ",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

//#endregion Creating records

//#region updating records 
export async function updateEcole(clientId:string, ecoleData: UpdateEcoleDO, username : string) : Promise<DisplayEcoleDO|null> {
    const functionName = "updateEcole";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const ecole = await getEcoleById(clientId, ecoleData.id);
        if (ecole === null) throw new Error("École inconnue pour ce client");
        const updatedEcole = await prisma.sgs_ecole.update({
            where : {id : ecoleData.id},
            data : {
                full_name               : ecoleData.full_name,
                short_name              : ecoleData.short_name,
                establishment_date      : ecoleData.establishment_date,
                primary_contact_name    : ecoleData.primary_contact_name,
                secondary_contact_name  : ecoleData.secondary_contact_name,
                contact_infos           : ecoleData.contact_infos,
                phone_number            : ecoleData.phone_number,
                email                   : ecoleData.email,
                website                 : ecoleData.website,
                notes                   : ecoleData.notes,
                change_date             : new Date(),
                changed_by              : username
            }
        });
        if (!updatedEcole || updatedEcole === null) return null;
        return ToDisplayEcoleDO(updatedEcole);
    }
    catch(error:any) {
        logError('F',"Echec : Mise à jour d'une école ",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function updateSettings(clientId:string, anneescolaireId:string, username : string) : Promise<ClientSettingsDO|null> {
    const functionName = "updateSettings";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const clientSetting = await prisma.sgs_client_setting.findFirst({
            where : {
                client_id : clientId
            }
        });
        if (!clientSetting || clientSetting===null) return null;
        const updatedSetting = await prisma.sgs_client_setting.update({
            where : {
                id : clientSetting.id
            },
            data : {
                anneescolaire_id : anneescolaireId,
                change_date             : new Date(),
                changed_by              : username
            }
        });
        if (!updatedSetting || updatedSetting === null) return null;
        return ToClientSettingsDO(updatedSetting);
    }
    catch(error:any) {
        logError('F',"Echec : Mise à jour des paramètres client ",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}
//#endregion Creating records








export async function functionName() {
    const functionName = "functionName";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        // Your code logic here
    }
    catch(error:any) {
        logError('F',"Echec : function description ",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}