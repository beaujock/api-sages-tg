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