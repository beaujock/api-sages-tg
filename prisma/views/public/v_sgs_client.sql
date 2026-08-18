SELECT
  c.id,
  sco.code AS systeme_scolaire,
  CASE
    WHEN (c.active = TRUE) THEN 'Actif' :: text
    ELSE 'Inactif' :: text
  END AS active,
  cs.display_value AS STATUS,
  c.legal_name,
  c.short_name,
  c.code,
  c.address,
  c.website,
  c.main_contact_name,
  c.main_contact_email,
  c.main_contact_phone,
  c.other_contact_infos,
  c.notes,
  c.create_date,
  c.created_by,
  c.change_date,
  c.changed_by
FROM
  (
    (
      sgs_client c
      LEFT JOIN tg_systeme_scolaire sco ON ((sco.id = c.systeme_scolaire_id))
    )
    LEFT JOIN lkp_client_status cs ON (((cs.code) :: text = (c.status) :: text))
  );