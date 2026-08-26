import { sgs_client_module_role_menu_item } from "@/lib/generated/prisma/client";

export type UserBaseInfos = {
    id                      : string;
    user_name               : string;
    email                   : string;
    first_login             : boolean;
}

export type ResourceCombo = {
        type_resource : string,
        resource_id : string
    }

export type SagesMenuItem = {
    display_name    : string;
    icon_name       : string|null;
    end_route       : string;
    active          : boolean;
}

export function ToSagesMenuItem(menuItem : sgs_client_module_role_menu_item) : SagesMenuItem {
    return {
        display_name    : menuItem.display_name,
        icon_name       : menuItem.icon_name,
        end_route       : menuItem.end_route,
        active          : menuItem.active,
    }
}