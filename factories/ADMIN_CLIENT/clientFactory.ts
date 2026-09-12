import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { getYear } from 'date-fns';
import { logError } from "../ALL_USAGE/allUsageFactories";
import { DisplayClientDO, DisplayEcoleDO, DisplayEleveDO, DisplayEnseignantDO, DisplayInscriptionDO, DisplaySalleClasseDO } from "@/types/ADMIN_CLIENT/AdminClientDisplays";
import { OverviewEleveDO, OverviewEnseignantDO } from "@/types/ADMIN_CLIENT/AdminClientOverviews";
import { InfoMatiereDO} from "@/types/ALL_USAGE/AllUsagesTypes";
const ErrorOrigin = "ADMIN_CLIENT : clientFactory";

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
        return {
            id                       : client.id,
            systeme_scolaire_id      : client.systeme_scolaire_id,
            systeme_scolaire_label   : client.tg_systeme_scolaire.code,
            active                   : client.active,
            active_label             : (client.active)?("Actif"):("Inactif"),
            status                   : client.status,
            status_label             : client.lkp_client_status.display_value,
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
    catch(error:any) {
        logError('F',"Echec : Retrouver un client par son identifiant",ErrorOrigin + " - " + functionName, error.message, true);
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
        return {
            id                       : client.id,
            systeme_scolaire_id      : client.systeme_scolaire_id,
            systeme_scolaire_label   : client.tg_systeme_scolaire.code,
            active                   : client.active,
            active_label             : (client.active)?("Actif"):("Inactif"),
            status                   : client.status,
            status_label             : client.lkp_client_status.display_value,
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
    catch(error:any) {
        logError('F',"Echec : Retrouver un client par son code",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export async function getEcoleById(ecoleId:string) : Promise<DisplayEcoleDO|null> {
    const functionName = "getEcoleById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const ecole = await prisma.sgs_ecole.findFirst({
            where : {
                id : ecoleId
            }
        });
        if(!ecole) return null;
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
    catch(error:any) {
        logError('F',"Echec : Retrouver une école par son identifiant",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export async function getSalleClasseById(salleClasseId:string) : Promise<DisplaySalleClasseDO|null> {
    const functionName = "getSalleClasseById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const salleClasse = await prisma.sgs_salle_classe.findUnique({
            where : {
                id : salleClasseId
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
        logError('F',"Echec : Retrouver une classe par son identifiant",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export async function getEleveById(eleveId:string) : Promise<DisplayEleveDO|null> {
    const functionName = "getEleveById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const eleve = await prisma.sgs_eleve.findUnique({
            where : {
                id : eleveId
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
        logError('F',"Echec : Retrouver un élève par son identifiant",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export async function getInscriptionById(inscriptionId:string) : Promise<DisplayInscriptionDO|null> {
    const functionName = "getInscriptionById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const inscription = await prisma.sgs_inscription.findUnique({
            where : {
                id : inscriptionId
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
        logError('F',"Echec : Retrouver une inscription par son identifiant",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export async function getEnseignantById(enseignantId:string) : Promise<DisplayEnseignantDO|null> {
    const functionName = "getEnseignantById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const enseignant = await prisma.sgs_enseignant.findUnique({
            where : {
                id : enseignantId
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
        logError('F',"Echec :Retrouver un enseignant par son identifiant",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export async function getClientEcoles(clientId:string) : Promise<DisplayEcoleDO[]> {
    const functionName = "getClientEcoles";
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
                sgs_ecole : true
            }
        });
        if(clientEcoles.length === 0) return [];
        for(const clientEcole of clientEcoles) {
            if (clientEcole.sgs_ecole) {
                const ecoleDetails = await getEcoleById(clientEcole.sgs_ecole.id);
                if(ecoleDetails) listEcoles.push(ecoleDetails);
            }
        }
        return [... new Set(listEcoles)];
    }
    catch(error:any) {
        logError('F',"Liste des écoles d'un client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getEcoleSalleClasses(ecoleId:string, anneeScolaireId:string) : Promise<DisplaySalleClasseDO[]> {
    const functionName = "getEcoleSalleClasses";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listSallesClasses:DisplaySalleClasseDO[] = [];
        const salleClasses = await prisma.sgs_salle_classe.findMany({
            where : {
                ecole_id : ecoleId,
                annee_scolaire_id : anneeScolaireId
            }
        });
        for(const salleClasse of salleClasses) {
            const salleClasseDetails = await getSalleClasseById(salleClasse.id);
            if (salleClasseDetails) {
                listSallesClasses.push(salleClasseDetails);
            }
        }
        return [... new Set(listSallesClasses)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes d'une école ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getClientSalleClasses(clientId:string, anneeScolaireId:string) : Promise<DisplaySalleClasseDO[]> {
    const functionName = "getClientSalleClasses";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        let listSallesClasses:DisplaySalleClasseDO[] = [];
        const listEcoles = await getClientEcoles(clientId);
        if (listEcoles.length === 0) return [];
        for(const ecole of listEcoles) {
            const salleClasses = await getEcoleSalleClasses(ecole.id, anneeScolaireId);
            listSallesClasses = [...listSallesClasses, ...salleClasses];
        }
        return [... new Set(listSallesClasses)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes d'une client ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getSalleClasseEnseignants(salleclasseId:string) : Promise<DisplayEnseignantDO[]> {
    const functionName = "getSalleClasseEnseignants";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEnseignants:DisplayEnseignantDO[] = [];
        const portfolioEnseignants = await prisma.sgs_portfolio_enseignant.findMany({
            where : {
                sgs_salle_classe_matiere : {
                    salle_classe_id : salleclasseId
                }
            },
            include : {
                sgs_enseignant : true
            }
        });
        if (portfolioEnseignants.length === 0) return [];
        for (const portfolioEnseignant of portfolioEnseignants) {
            if (portfolioEnseignant.sgs_enseignant) {
                const enseignantDetails = await getEnseignantById(portfolioEnseignant.sgs_enseignant.id);
                if (enseignantDetails) {
                    listEnseignants.push(enseignantDetails);
                }
            }
        }
        return [...new Set(listEnseignants)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les enseignants d'une classe ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getEcoleEnseignants(ecoleId:string, anneeScolaireId:string) : Promise<DisplayEnseignantDO[]> {
    const functionName = "getEcoleEnseignants";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEnseignants:DisplayEnseignantDO[] = [];
        const listClasses = await getEcoleSalleClasses(ecoleId, anneeScolaireId);
        if (listClasses.length === 0) return [];
        for (const salleClasse of listClasses) {
            const enseignants = await getSalleClasseEnseignants(salleClasse.id);
            listEnseignants.push(...enseignants);
        }
        return [...new Set(listEnseignants)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les enseignants d'une école ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getClientEnseignants(salleclasseId:string, anneeScolaireId:string) : Promise<DisplayEnseignantDO[]> {
    const functionName = "getEcoleEnseignants";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEnseignants:DisplayEnseignantDO[] = [];
        const listEcoles = await getClientEcoles(salleclasseId);
        if (listEcoles.length === 0) return [];
        for (const ecole of listEcoles) {
            const enseignants = await getEcoleEnseignants(ecole.id, anneeScolaireId);
            listEnseignants.push(...enseignants);
        }
        return [...new Set(listEnseignants)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les enseignants d'un client ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getSalleclasseEleves(salleclasseId:string) : Promise<DisplayEleveDO[]> {
    const functionName = "getSalleclasseEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEleves:DisplayEleveDO[] = [];
        const inscriptions = await prisma.sgs_inscription.findMany({
            where : {
                salle_classe_id : salleclasseId
            },
            include : {
                sgs_eleve : true
            }
        });
        for(const inscription of inscriptions) {
            if (inscription.sgs_eleve.id) {
                const eleveDetails = await getEleveById(inscription.sgs_eleve.id);
                if (eleveDetails) listEleves.push(eleveDetails);
            }
        }
        return [...new Set(listEleves)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les élèves d'une classe ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getEcoleEleves(ecoleId:string, anneescolaireId:string) : Promise<DisplayEleveDO[]> {
    const functionName = "getEcoleEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEleves:DisplayEleveDO[] = [];
        const listSalleclasses = await getEcoleSalleClasses(ecoleId, anneescolaireId);
        if(listSalleclasses.length === 0) return [];
        for (const salleclasse of listSalleclasses ) {
            const eleves = await getSalleclasseEleves(salleclasse.id);
            listEleves.push(...eleves);
        }
        return [...new Set(listEleves)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les élèves d'un école ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getClientEleves(clientId:string, anneescolaireId:string) : Promise<DisplayEleveDO[]> {
    const functionName = "getClientEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEleves:DisplayEleveDO[] = [];
        const listSalleclasses = await getClientSalleClasses(clientId, anneescolaireId);
        if(listSalleclasses.length === 0) return [];
        for (const salleclasse of listSalleclasses ) {
            const eleves = await getSalleclasseEleves(salleclasse.id);
            listEleves.push(...eleves);
        }
        return [...new Set(listEleves)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les élèves d'un école ",ErrorOrigin + " - " + functionName, error.message, true);
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
            }
        });
        for(const salleClasse of salleClasses) {
            const salleClasseDetails = await getSalleClasseById(salleClasse.salle_classe_id);
            if (salleClasseDetails) {
                listSallesClasses.push(salleClasseDetails);
            }
        }
        return [... new Set(listSallesClasses)];
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes d'un enseignant ",ErrorOrigin + " - " + functionName, error.message, true);
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
                    sgs_client_ecole : {
                        some : {
                            client_id : clientId
                        }
                    }
                }
            },
            include : {
                tg_matiere : true
            }
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
        logError('F',"Echec : Lister les matières d'un enseignant ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getEleveOverview(clientId:string, ecoleId:string, anneeScolaireId:string, salleClasseId:string, eleveId:string) : Promise<OverviewEleveDO|null> {
    const functionName = "getEleveOverview";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const inscription = await prisma.sgs_inscription.findFirst({
            where : {
                eleve_id : eleveId,
                salle_classe_id : salleClasseId,
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
            number_evaluations      : 0, // to be calculated based on evaluations data
            number_absences         : 0, // to be calculated based on absences data
            number_bulletins        : 0 // to be calculated based on bulletins data
        }
        
    }
    catch(error:any) {
        logError('F',"Echec : Générer la vue d'ensemble d'un élève",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export async function getEnseignantOverview(clientId:string, ecoleId:string, anneeScolaireId:string, enseignantId:string) : Promise<OverviewEnseignantDO|null> {
    const functionName = "functionName";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const portfolioEnseignant = await prisma.sgs_portfolio_enseignant.findFirst({
            where : {
                enseignant_id : enseignantId,
                sgs_salle_classe_matiere : {
                    sgs_salle_classe : {
                        ecole_id : ecoleId,
                        annee_scolaire_id : anneeScolaireId,
                        sgs_client_ecole : {
                            some : {
                                client_id : clientId
                            }
                        }
                    }
                }
            },
            include : {
                sgs_enseignant : true,
                sgs_salle_classe_matiere : {
                    include : {
                        sgs_salle_classe : {
                            include : {
                                sgs_ecole : true,
                                tg_annee_scolaire : true
                            }
                        }
                    }
                }
            }
        });
        if(!portfolioEnseignant) return null;
        const enseignant = portfolioEnseignant.sgs_enseignant;
        const salleClasses = await getEnseignantSalleClasses(clientId, ecoleId, anneeScolaireId, enseignantId);
        const matieres = await getEnseignantMatieres(clientId, ecoleId, anneeScolaireId, enseignantId);
        return {
            id                      : enseignant.id,
            enseignant_label        : enseignant.first_name + " " + enseignant.last_name,
            ecole_id                : portfolioEnseignant.sgs_salle_classe_matiere.sgs_salle_classe.ecole_id,
            ecole_label             : portfolioEnseignant.sgs_salle_classe_matiere.sgs_salle_classe.sgs_ecole.short_name === null ? portfolioEnseignant.sgs_salle_classe_matiere.sgs_salle_classe.sgs_ecole.full_name : portfolioEnseignant.sgs_salle_classe_matiere.sgs_salle_classe.sgs_ecole.short_name,
            annee_scolaire_id       : portfolioEnseignant.sgs_salle_classe_matiere.sgs_salle_classe.annee_scolaire_id,
            annee_scolaire_label    : getYear(portfolioEnseignant.sgs_salle_classe_matiere.sgs_salle_classe.tg_annee_scolaire.start_date).toString() + "-" + getYear(portfolioEnseignant.sgs_salle_classe_matiere.sgs_salle_classe.tg_annee_scolaire.end_date).toString(),
            number_salles_classes   : salleClasses.length,
            number_matieres         : matieres.length,
            number_evaluations      : 0, // to be calculated based on evaluations data
            number_absences         : 0, // to be calculated based on absences data
            number_bulletins        : 0 // to be calculated based on bulletins data
        }
    }
    catch(error:any) {
        logError('F',"Echec : function description ",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}


export async function functionName() {
    const functionName = "functionName";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        // Your code logic here
    }
    catch(error:any) {
        logError('F',"Echec : function description ",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}