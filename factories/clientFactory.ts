import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { getCurrentAnneeScolaire, logError } from "./utilitiesFactory";
import { getYear } from 'date-fns';
import { AdminClientClientDisplay, AdminClientClientOverview, AdminClientEcoleDisplay, AdminClientEleveDisplay, AdminClientSalleClasseDisplay, ToAdminClientEcoleDisplay, ToAdminClientEleveDisplay } from "@/types/ADMIN_CLIENT/AdminClientTypes";
import { tg_menu } from "@/lib/generated/prisma/browser";


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
                lkp_client_module_status : true
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
            status_label             : client.lkp_client_module_status.display_value,
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
                active : true
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

export async function getClientOverview(clientId:string, anneeScolaireId:string|null) : Promise<AdminClientClientOverview> {
    const functionName = "getClientOverview";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const client = await getClientById(clientId);
        if (!client || client===null) return {
            client              : null,
            numberEcoles        : 0,
            numberSalleClasses  : 0,
            numberEnseignants   : 0,
            numberEleves        : 0
        };
        const ecoles = await getClientEcoles(clientId);
        const salleclasses = await getClientSalleClasses(clientId, anneeScolaireId);
        const eleves = await getClientEleves(clientId, anneeScolaireId);
        return {
            client              : client,
            numberEcoles        : ecoles.length,
            numberSalleClasses  : salleclasses.length,
            numberEnseignants   : 0,
            numberEleves        : eleves.length
        }
    }
    catch(error:any){
        logError('F',"Console Client",ErrorOrigin + " : " + functionName, error.message, true);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getClientMenuItemsByRole(clientId:string,role:string) : Promise<tg_menu[]> {
  const functionName = "getClientMenuItemsByRole";
  try {
    const isConnected = await verifyAndSetPrismaConnection();
    if (!isConnected) throw new Error("Vous n'êtes pas connecté!");
    let roleCode = role.toUpperCase(); // Ensure the role is in uppercase
    const menuItems: tg_menu[] = [];
    const roleMenus = await prisma.tg_role_menu.findMany({
      where: {
        active: true,
        tg_role: {
          code: roleCode
        },
        sgs_client_role_menu: {
          some: {
            client_id: clientId,
            active: true
          },
        },
      },
      orderBy: {
        item_order: 'asc',
      },
      include: {
        tg_menu: true,
      },
    });
    for (const roleMenu of roleMenus) {
      menuItems.push(roleMenu.tg_menu);
    }
    return menuItems;
  }
  catch(error:any) {
    throw new Error(ErrorOrigin + functionName + error.message);
  }
}
