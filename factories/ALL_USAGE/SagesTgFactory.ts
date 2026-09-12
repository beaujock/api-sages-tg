import { verifyAndSetPrismaConnection, prisma } from "@/lib/prisma";
import { getYear } from 'date-fns';
import { logError } from "./allUsageFactories";
import { InfoMenuItemLinkActionDO, InfoModuleDO, InfoRoleDO } from "@/types/ALL_USAGE/AllUsagesTypes";
const ErrorOrigin = "ALL_USAGE : menuFactory";

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

export async function getModuleRoleMenuItems(moduleId:string, roleId:string) : Promise<InfoMenuItemLinkActionDO[]> {
    const functionName = "getClientRoleMenuItems";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listMenuItems:InfoMenuItemLinkActionDO[] = [];
        const roleModuleMenuItems= await prisma.tg_role_module_menu_item.findMany({
            where : {
                role_id : roleId,
                module_id : moduleId
            },
            include : {
                tg_menu_item : true
            },
            orderBy : [{
                tg_module : {
                    module_order : 'asc'
                }
            }]
        });
        if (!roleModuleMenuItems || roleModuleMenuItems.length === 0) return [];
        for (const item of roleModuleMenuItems) {
            if (item) listMenuItems.push({
                id : item.tg_menu_item.id,
                display_name : item.tg_menu_item.display_name,
                icon_name : item.tg_menu_item.icon_name,
                end_route : item.tg_menu_item.end_route,
                order : item.tg_menu_item.item_order,
                description : item.tg_menu_item.description
            });
        };
        return [... new Set(listMenuItems)];
    }
    catch(error:any) {
        logError('F',"Echec : Retrouver les elements de menu d'un module et d'un role",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}

export async function getModuleRoleMenuLinks(moduleId:string, roleId:string) : Promise<InfoMenuItemLinkActionDO[]> {
    const functionName = "getModuleRoleMenuLinks";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listMenuItems:InfoMenuItemLinkActionDO[] = [];
        const roleModuleMenuItems= await prisma.tg_role_module_menu_item_link.findMany({
            where : {
                tg_role_module_menu_item : {
                    module_id : moduleId,
                    role_id : roleId
                }
            },
            include : {
                tg_link : true
            },
            orderBy : [{
                tg_role_module_menu_item : {
                    tg_module : {
                        module_order : 'asc'
                    }
                }
            }]
        });
        if (!roleModuleMenuItems || roleModuleMenuItems.length === 0) return [];
        let order = 10;
        for (const item of roleModuleMenuItems) {
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

export async function getModuleRoleMenuActions(moduleId:string, roleId:string) : Promise<InfoMenuItemLinkActionDO[]> {
    const functionName = "getModuleRoleMenuActions";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listMenuItems:InfoMenuItemLinkActionDO[] = [];
        const roleModuleMenuItems= await prisma.tg_role_module_menu_item_action.findMany({
            where : {
                tg_role_module_menu_item : {
                    module_id : moduleId,
                    role_id : roleId
                }
            },
            include : {
                tg_action : true
            },
            orderBy : [{
                tg_role_module_menu_item : {
                    tg_module : {
                        module_order : 'asc'
                    }
                }
            }]
        });
        if (!roleModuleMenuItems || roleModuleMenuItems.length === 0) return [];
        let order = 10;
        for (const item of roleModuleMenuItems) {
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

/*export async function getClientRoleMenuItems(clientId:string, roleId:string) : Promise<DisplayMenuItemDO[]> {
    const functionName = "getClientRoleMenuItems";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listMenuItems:DisplayMenuItemDO[] = [];
        const clientModules = await getClientModules(clientId);
        if (!clientModules || clientModules.length === 0) return [];
        for (const cm of clientModules) {
            if(cm) {
                const items = await getModuleRoleMenuItems(cm.id, roleId);
                if (items) listMenuItems.push(...items)
            };
        };
        return [... new Set(listMenuItems)];
    }
    catch(error:any) {
        logError('F',"Echec : Retrouvers les elements de menu d'un client et d'un role ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}
*/

/*export async function getClientModules(clientId:string) : Promise<DisplayModuleDO[]> {
    const functionName = "getClientModules";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const listModules:DisplayModuleDO[] = [];
        const clientModules = await prisma.sgs_client_module.findMany({
            where : {
                client_id : clientId,
                active : true,
                status : 'A'
            },
            include : {
                tg_module : true
            },
            orderBy : [{
                tg_module : {
                    module_order : 'asc'
                }
            }]
        });
        if (!clientModules || clientModules.length === 0) return [];
        for (const cm of clientModules) {
            if (cm) {
                const module = await getModuleById(cm.tg_module.id)
                if (module) listModules.push(module);
            }
        };
        return [... new Set(listModules)];
    }
    catch(error:any) {
        logError('F',"Echec : function description ",ErrorOrigin + " - " + functionName, error.message, true);
        return [];
    }
}


export async function getUserClient(userId:string) : Promise<DisplayClientDO|null> {
    const functionName = "getUserClient";
    try {
        const isConnected = await verifyAndSetPrismaConnection();
        if ( !isConnected ) throw new Error("Vous n'êtes pas connecté!");
        const clients = await prisma.sgs_client_user.findMany({
            where : {
                user_id : userId,
                status : 'A'
            },
            include : {
                sgs_client : true
            }
        });
        if (!clients || clients.length === 0) return null;
        if (clients.length > 1) throw new Error("Utilisateur avec plusieurs clients !");
        return {
            id : clients[0].sgs_client.id,
            legal_name : clients[0].sgs_client.legal_name,
            short_name : clients[0].sgs_client.short_name,
            code : clients[0].sgs_client.code
        }
    }
    catch(error:any) {
        logError('F',"Echec : function description ",ErrorOrigin + " - " + functionName, error.message, true);
        return null;
    }
}

*/