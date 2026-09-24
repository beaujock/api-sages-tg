export type InfoMatiereDO = {
    id                  : string;
    full_name           : string;
    short_name          : string|null;
    code                : string;
}

export type InfoModuleDO = {
    id:         string;
    full_name:  string;
    short_name: string;
    code:       string;
    order:      number;
}

export type InfoMenuItemLinkActionDO = {
    id :            string;
    display_name :  string;
    icon_name :     string|null;
    end_route :     string;
    order :         number;
    description :   string|null
}

export type InfoClientDO = {
    id :                string;
    legal_name :        string;
    short_name :        string;
    code :              string;
}

export type InfoUserDO = {
    id :                string;
    user_name :         string;
    full_name :         string;
    email :             string;
}

export type InfoRoleDO = {
    id :                string;
    name :              string;
    code :              string;
}

export type InfoClientMenuDO = {
    items   : InfoMenuItemLinkActionDO[];
    links   : InfoMenuItemLinkActionDO[];
    actions : InfoMenuItemLinkActionDO[];
}

export type InfoRoleModuleMenuItemDO = {
    id          : string,
    item        : string,
    module      : string,
    role        : string,
    display_name :  string;
    icon_name :     string|null;
    end_route :     string;
    order :         number;
    description :   string|null
}

export type SagesToken = {
    user_id            : string;
    user_full_name     : string;
    effective_date     : Date,
    expiry_date        : Date
    user_ip_address    : string;
    user_agent         : string;
    host               : string;
}

export type InfoClasseDO = {
    id : string;
    short_name : string;
}

export type InfoAnneeScolaireDO = {
    id             : string;
    start_date     : Date;
    end_date       : Date;
    label          : string;
}

export type InfoGenderDO = {
    code : string;
    label : string;
}

export type InfoResourceTypeDO = {
    code : string;
    label : string;
}