import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { getYear } from 'date-fns';
import { logError } from "./allUsageFactories";
import { InfoAnneeScolaireDO, InfoClasseDO, InfoGenderDO, InfoMenuItemLinkActionDO, InfoModuleDO, InfoResourceTypeDO, InfoRoleDO, InfoRoleModuleMenuItemDO } from "@/types/ALL_USAGE/AllUsagesTypes";
import { DisplayAnneeScolaireDO, ToDisplayAnneeScolaireDO } from "@/types/ADMIN_CLIENT/Displays";
import { tg_role } from "@/lib/generated/prisma/client";
const ErrorOrigin = "SagesTgFactory";

export async function getAnneeScolaireById(anneeScolaireIdId:string) : Promise<DisplayAnneeScolaireDO|null> {
    const functionName = "getAnneeScolaireById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const anneeScolaire = await prisma.tg_annee_scolaire.findFirst({
            where : {
                id : anneeScolaireIdId
            }
        });
        if(!anneeScolaire) return null;
        return ToDisplayAnneeScolaireDO(anneeScolaire);
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver une école par son identifiant",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

export async function getModuleById(moduleId:string) : Promise<InfoModuleDO|null>{
    const functionName = "getModuleById";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const module = await prisma.tg_module.findUnique({
            where : {
                id : moduleId
            }
        });
        if(!module || module===null) return null;
        return {
            id : module.id,
            full_name : module.full_name,
            short_name : module.short_name,
            code : module.code,
            order : module.module_order
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver un module par son identifiant",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getModuleByCode(moduleCode:string) : Promise<InfoModuleDO|null>{
    const functionName = "getModuleByCode";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const module = await prisma.tg_module.findUnique({
            where : {
                code : moduleCode
            }
        });
        if(!module || module===null) return null;
        return {
            id : module.id,
            full_name : module.full_name,
            short_name : module.short_name,
            code : module.code,
            order : module.module_order
        }
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver un module par son code",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}

export async function getModuleRoleMenuItems(moduleId:string, roleId:string) : Promise<InfoRoleModuleMenuItemDO[]> {
    const functionName = "getModuleRoleMenuItems";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listMenuItems:InfoRoleModuleMenuItemDO[] = [];
        const roleModuleMenuItems= await prisma.tg_role_module_menu_item.findMany({
            where : {
                role_id : roleId,
                module_id : moduleId
            },
            include : {
                tg_menu_item : true,
                tg_module : true,
                tg_role : true
            },
            orderBy : [{
                tg_menu_item : {
                    item_order : 'asc'
                }
            }]
        });
        if (!roleModuleMenuItems || roleModuleMenuItems.length === 0) return [];
        return roleModuleMenuItems.map((item) => ({
            id: item.id,
            item: item.tg_menu_item?.display_name ?? 'Unknown',
            module: item.tg_module?.code ?? 'Unknown',
            role: item.tg_role?.code ?? 'Unknown',
            display_name: item.tg_menu_item?.display_name ?? 'Unknown',
            icon_name: item.tg_menu_item?.icon_name ?? '',
            end_route: item.tg_menu_item?.end_route ?? '',
            order: item.tg_menu_item?.item_order ?? 0,
            description: item.tg_menu_item?.description ?? ''
        }));
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver les elements de menu d'un module et d'un role",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getModuleRoleMenuLinks(roleModuleMenuItemId:string) : Promise<InfoMenuItemLinkActionDO[]> {
    const functionName = "getModuleRoleMenuLinks";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listMenuItems:InfoMenuItemLinkActionDO[] = [];
        const roleModuleMenuLinks= await prisma.tg_role_module_menu_item_link.findMany({
            where : {
                role_module_menu_item_id : roleModuleMenuItemId
            },
            include : {
                tg_link : true
            }
        });
        if (!roleModuleMenuLinks || roleModuleMenuLinks.length === 0) return [];
        let order = 10;
        for (const item of roleModuleMenuLinks) {
            if (item) listMenuItems.push({
                id : item.tg_link.id,
                display_name : item.tg_link.display_name,
                icon_name : item.tg_link.icon_name,
                end_route : item.tg_link.end_route,
                order : order,
                description : item.tg_link.description
            });
            order = order + 10;
        };
        return [... new Set(listMenuItems)];
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver les liens de menu d'un module et d'un role",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getModuleRoleMenuActions(roleModuleMenuItemId:string) : Promise<InfoMenuItemLinkActionDO[]> {
    const functionName = "getModuleRoleMenuActions";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listMenuItems:InfoMenuItemLinkActionDO[] = [];
        const roleModuleMenuActions= await prisma.tg_role_module_menu_item_action.findMany({
            where : {
                role_module_menu_item_id : roleModuleMenuItemId
            },
            include : {
                tg_action : true
            }
        });
        if (!roleModuleMenuActions || roleModuleMenuActions.length === 0) return [];
        let order = 10;
        for (const item of roleModuleMenuActions) {
            if (item) listMenuItems.push({
                id : item.tg_action.id,
                display_name : item.tg_action.display_name,
                icon_name : item.tg_action.icon_name,
                end_route : item.tg_action.end_route,
                order : order,
                description : item.tg_action.description
            });
            order = order + 10;
        };
        return [... new Set(listMenuItems)];
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver les actions de menu d'un module et d'un role",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getAllRoles() : Promise<InfoRoleDO[]> {
    const functionName = "getAllRoles";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listRoles:InfoRoleDO[] = [];
        const allRoles = await prisma.tg_role.findMany();
        if (!allRoles || allRoles.length === 0) return [];
        for(const role of allRoles) {
            if (role) listRoles.push({
                id : role.id,
                name : role.name,
                code : role.code
            });
        };
        return [... new Set(listRoles)];
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver tous les roles ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getAllAnneeScolaires() : Promise<InfoAnneeScolaireDO[]> {
    const functionName = "getAllAnneeScolaires";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listAnneeScolaires:InfoAnneeScolaireDO[] = [];
        const allAnneeScolaires = await prisma.tg_annee_scolaire.findMany();
        if (!allAnneeScolaires || allAnneeScolaires.length === 0) return [];
        for(const anneeScolaire of allAnneeScolaires) {
            if (anneeScolaire) listAnneeScolaires.push({
                id : anneeScolaire.id,
                start_date : anneeScolaire.start_date,
                end_date : anneeScolaire.end_date,
                label : getYear(anneeScolaire.start_date).toString() + "-" + getYear(anneeScolaire.end_date).toString()
            });
        };
        return [... new Set(listAnneeScolaires)];
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver tous les roles ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getAllGenders() : Promise<InfoGenderDO[]> {
    const functionName = "getAllGenders";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listGenders:InfoGenderDO[] = [];
        const allGenders = await prisma.lkp_gender.findMany();
        if (!allGenders || allGenders.length === 0) return [];
        for(const gender of allGenders) {
            if (gender) listGenders.push({
                code : gender.code,
                label : gender.display_value
            });
        };
        return [... new Set(listGenders)];
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver tous les roles ",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
    }
}

export async function getAllResourceTypes() : Promise<InfoResourceTypeDO[]> {
    const functionName = "getAllResourceTypes";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listResourceTypes:InfoResourceTypeDO[] = [];
        const allResourceTypes = await prisma.lkp_gender.findMany();
        if (!allResourceTypes || allResourceTypes.length === 0) return [];
        for(const resourceType of allResourceTypes) {
            if (resourceType) listResourceTypes.push({
                code : resourceType.code,
                label : resourceType.display_value
            });
        };
        return [... new Set(listResourceTypes)];
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver tous les type de resources",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
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
        logError('F',"Obtenir un client",ErrorOrigin + " : " + functionName, error.message, false);
        throw new Error(ErrorOrigin + " : " + functionName + "\n" + error.message);
    }
}

export async function getEnseignementClasses(enseignementId:string) : Promise<InfoClasseDO[]> {
    const functionName = "getEnseignementClasses";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listClasses:InfoClasseDO[] = [];
        const classes = await prisma.tg_classe.findMany({
            where : {
                tg_niveau : {
                    enseignement_id : enseignementId
                }
            }
        });
        if (!classes || classes.length === 0) return [];
        for (const cl of classes) {
            listClasses.push({
                id : cl.id,
                short_name : cl.short_name
            });
        }

        return listClasses;
    }
    catch(error:any) {
        logError('F',"Echec : Lister les classes d'un senseignement",ErrorOrigin + " - " + functionName, error.message, false);
        return [];
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
        logError('F',"Echec : function description ",ErrorOrigin + " - " + functionName, error.message, false);
        return null;
    }
}
