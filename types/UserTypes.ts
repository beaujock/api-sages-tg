export type UserConnectInfos = {
    user_name               : string;
    email                   : string;
    token                   : string|null;
    token_effective_time    : Date|null;
    token_expiry_time       : Date|null;   
}