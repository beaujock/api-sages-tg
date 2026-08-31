import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { getCurrentAnneeScolaire, logError } from "./utilitiesFactory";
import { getYear } from 'date-fns';
import { AdminClientClientDisplay, AdminClientUpdateEcoleRequest, AdminClientEcoleDisplay, AdminClientEleveDisplay, AdminClientSalleClasseDisplay, ToAdminClientEcoleDisplay, ToAdminClientEleveDisplay, AdminClientEnseignantDisplay, AdminClientUserDisplay, ToAdminClientUserDisplay } from "@/types/ADMIN_CLIENT/AdminClientTypes";
import { tg_role } from "@/lib/generated/prisma/browser";
import { SagesMenuItem, ToSagesMenuItem } from "@/types/USERX/UserTypes";
import { sgs_client_module, tg_annee_scolaire } from "@/lib/generated/prisma/client";


const ErrorOrigin = "clientFactory";

export async function getClientById(clientId:string) : Promise<AdminClientClientDisplay|null> {
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
        logError('F',"Obtenir un client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientEcolesById(clientId:string, ecoleId:string ) : Promise<AdminClientEcoleDisplay|null> {
    const functionName = "getClientEcoles";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEcoles:AdminClientEcoleDisplay[] = [];
        const clientEcoles = await prisma.sgs_client_ecole.findFirst({
            where : {
                client_id : clientId,
                status : 'A',
                active : true,
                sgs_ecole : {
                    id : ecoleId
                }
            },
            include : {
                sgs_ecole : true
            }
        });
        return (clientEcoles === null)?(null):(ToAdminClientEcoleDisplay(clientEcoles.sgs_ecole));
    }
    catch(error:any) {
        logError('F',"Liste des écoles du client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientByCode(clientCode:string) : Promise<AdminClientClientDisplay|null> {
    const functionName = "getClientById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const client = await prisma.sgs_client.findFirst({
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
        logError('F',"Obtenir un client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientEcoles(clientId:string) : Promise<AdminClientEcoleDisplay[]> {
    const functionName = "getClientEcoles";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEcoles:AdminClientEcoleDisplay[] = [];
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
        clientEcoles.forEach(clienEcole => {
            listEcoles.push(ToAdminClientEcoleDisplay(clienEcole.sgs_ecole));
        });
        return [... new Set(listEcoles)];
    }
    catch(error:any) {
        logError('F',"Liste des écoles du client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientSalleClasses(clientId:string, anneeScolaireId:string|null) : Promise<AdminClientSalleClasseDisplay[]> {
    const functionName = "getClientSalleClasses";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listSalleClasses:AdminClientSalleClasseDisplay[] = [];
        let schoolYearId:string|null;
        if (anneeScolaireId === null) {
            const schoolYear = await getCurrentAnneeScolaire();
            schoolYearId = (schoolYear===null)?(null):(schoolYear.id);
        };
        schoolYearId = anneeScolaireId;
        if (schoolYearId === null) throw new Error("Année scolaire non trouvée");
        const clientSalleClasses= await prisma.sgs_salle_classe.findMany({
            where : {
                annee_scolaire_id : schoolYearId,
                sgs_ecole : {
                    sgs_client_ecole: {
                        some: {
                            client_id : clientId
                        }
                    }
                }
            },
            include : {
                sgs_ecole : true,
                tg_annee_scolaire : true,
                tg_classe : true
            }
        });
        clientSalleClasses.forEach(salleclasse => {
            listSalleClasses.push({
                id                       : salleclasse.id,
                ecole_id                 : salleclasse.ecole_id,
                ecole_label              : (salleclasse.sgs_ecole.short_name === null)?(salleclasse.sgs_ecole.code):(salleclasse.sgs_ecole.short_name),
                annee_scolaire_id        : salleclasse.annee_scolaire_id,
                annee_scolaire_label     : getYear(salleclasse.tg_annee_scolaire.start_date) + "-" + getYear(salleclasse.tg_annee_scolaire.end_date),
                classe_id                : salleclasse.classe_id,
                classe_label             : (salleclasse.tg_classe.short_name === null)?(salleclasse.tg_classe.code):(salleclasse.tg_classe.short_name),
                code                     : salleclasse.code,
                description              : salleclasse.description,
                notes                    : salleclasse.notes,
                create_date              : salleclasse.create_date,
                created_by               : salleclasse.created_by,
                change_date              : salleclasse.change_date,
                changed_by               : salleclasse.changed_by
            });
        });
        return [... new Set(listSalleClasses)];
    }
    catch(error:any) {
        logError('F',"Recherche des classes du client pendant une année scolaire",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getRoleByCode(roleCode:string) : Promise<tg_role|null> {
    const functionName = "getRoleByCode";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const role = await prisma.tg_role.findFirst({
            where : {
                code : roleCode
            }
        });

        return role;
    }
    catch(error:any) {
        logError('F',"Obtenir un client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientModules(clientId:string) : Promise<sgs_client_module[]> {
    const functionName = "getClientById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const clientModules = await prisma.sgs_client_module.findMany({
            where : {
                client_id : clientId
            }
        });
        return clientModules

    }
    catch(error:any) {
        logError('F',"Obtenir un client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientEleves(clientId:string, anneeScolaireId:string|null) : Promise<AdminClientEleveDisplay[]> {
    const functionName = "getClientEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listEleves:AdminClientEleveDisplay[] = [];
        let schoolYearId:string|null;
        if (anneeScolaireId === null) {
            const schoolYear = await getCurrentAnneeScolaire();
            schoolYearId = (schoolYear===null)?(null):(schoolYear.id);
        };
        schoolYearId = anneeScolaireId;
        if (schoolYearId === null) throw new Error("Année scolaire non trouvée");
        const clientEleves= await prisma.sgs_eleve.findMany({
            where : {
                sgs_inscription : {
                    some: {
                        sgs_salle_classe : {
                            annee_scolaire_id : schoolYearId,
                            sgs_ecole : {
                                sgs_client_ecole: {
                                    some: {
                                        client_id : clientId
                                    }
                                }
                            }
                        }
                    }
                }
            }

        });
        clientEleves.forEach(eleve => {
            listEleves.push(ToAdminClientEleveDisplay(eleve));
        });
        return [... new Set(listEleves)];
    }
    catch(error:any) {
        logError('F',"Recherche des classes du client pendant une année scolaire",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientRoleMenuItems(clientCode: string, roleCode:string) : Promise<SagesMenuItem[]> {
    const functionName = "getClientEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const menuItems:SagesMenuItem[] = []; 
        const client = await getClientByCode(clientCode);
        if (client == null) return menuItems;
        const role = await getRoleByCode(roleCode);
        if (role === null) return menuItems;
        const clientModules = await getClientModules(client.id);
        const clientModulesIds:string[] = [];
        clientModules.forEach(cm  => {
            clientModulesIds.push(cm.id);
        });
        const items = await prisma.sgs_client_module_role_menu_item.findMany({
            where : {
                client_module_id : {
                    in : clientModulesIds
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
        logError('F',"Recherche des classes du client pendant une année scolaire",ErrorOrigin + " : " + functionName, error.message, true);
        return [];
        //throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientActiveUsers(clientId:string) : Promise<AdminClientUserDisplay[]> {
    const functionName = "getClientActiveUsers";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listUsers:AdminClientUserDisplay[] = [];
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
            listUsers.push(ToAdminClientUserDisplay(user));
        });
        return listUsers;
    }
    catch(error:any) {
        logError('F',"Recherche des utilisateurs actifs du client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientEcoleSalleclasses(clientId:string, ecoleId:string) : Promise<AdminClientSalleClasseDisplay[]> {
    const functionName = "getClientEleves";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listSalleClasses:AdminClientSalleClasseDisplay[] = [];
        const anneeScolaire = await getClientAnneeScolaire(clientId);
        if (anneeScolaire === null) return listSalleClasses;

        const salleClasses= await prisma.sgs_salle_classe.findMany({
            where : {
                annee_scolaire_id : anneeScolaire.id,
                ecole_id : ecoleId
            },
            include : {
                tg_annee_scolaire : true,
                tg_classe : true,
                sgs_ecole : true
            }

        });
        salleClasses.forEach(sc => {
            listSalleClasses.push({
                id                       : sc.id,
                ecole_id                 : sc.ecole_id,
                ecole_label              : sc.sgs_ecole.short_name || sc.sgs_ecole.full_name || 'Nom ecole inconnu',
                annee_scolaire_id        : sc.annee_scolaire_id,
                annee_scolaire_label     : getYear(sc.tg_annee_scolaire.start_date).toString() + "-" + getYear(sc.tg_annee_scolaire.end_date).toString(),
                classe_id                : sc.classe_id,
                classe_label             : sc.tg_classe.code,
                code                     : sc.code,
                description              : sc.description,
                notes                    : sc.notes,
                create_date              : sc.create_date,
                created_by               : sc.created_by,
                change_date              : sc.change_date,
                changed_by               : sc.changed_by
            });
        });
        return [... new Set(listSalleClasses)];
    }
    catch(error:any) {
        logError('F',"Recherche des classes du client pendant une année scolaire",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function updateClientEcole(clientId:string, ecoleId:string, updateEcoleRequest:AdminClientUpdateEcoleRequest, username:string) : Promise<AdminClientEcoleDisplay|null> {
    const functionName = "updateClientEcole";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const ecole = await prisma.sgs_ecole.update({
            where : {
                id : ecoleId
            },
            data : {
                full_name               : updateEcoleRequest.full_name,
                short_name              : updateEcoleRequest.short_name,
                establishment_date      : updateEcoleRequest.establishment_date,
                code                    : updateEcoleRequest.code,
                primary_contact_name    : updateEcoleRequest.primary_contact_name,
                secondary_contact_name  : updateEcoleRequest.secondary_contact_name,
                contact_infos           : updateEcoleRequest.contact_infos,
                phone_number            : updateEcoleRequest.phone_number,
                email                   : updateEcoleRequest.email,
                website                 : updateEcoleRequest.website,
                notes                   : updateEcoleRequest.notes,
                change_date             : new Date(),
                changed_by              : username
            }
        });
        return ecole;
    }
    catch(error:any) {
        logError('F',"Recherche des utilisateurs actifs du client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientAnneeScolaire(clientId:string) : Promise<tg_annee_scolaire|null> {
    const functionName = "getClientById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const setting = await prisma.sgs_client_setting.findFirst({
            where : {
                client_id : clientId
            }
        });
        if(setting === null || setting.anneescolaire_id === null) return await getCurrentAnneeScolaire();
        const anneeScolaire = await prisma.tg_annee_scolaire.findUnique({
            where : {
                id : setting.anneescolaire_id
            }
        });
        if (anneeScolaire === null) return await getCurrentAnneeScolaire();
        return anneeScolaire;

    }
    catch(error:any) {
        logError('F',"Obtenir un client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}


