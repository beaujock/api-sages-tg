

//#region Ecole updates
export type UpdateEcoleDO = {
    id                      : string;
    full_name               : string;
    short_name              : string;
    establishment_date      : Date|null;
    primary_contact_name    : string|null;
    secondary_contact_name  : string|null;
    contact_infos           : string|null;
    phone_number            : string|null;
    email                   : string|null;
    website                 : string|null;
    notes                   : string|null;
}
//#endregion
