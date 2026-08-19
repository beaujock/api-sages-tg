SELECT
  v.id,
  eco.short_name AS ecole,
  (
    (
      to_char(
        (ann.start_date) :: timestamp WITH time zone,
        'YYYY' :: text
      ) || '-' :: text
    ) || to_char(
      (ann.end_date) :: timestamp WITH time zone,
      'YYYY' :: text
    )
  ) AS annee_scolaire,
  cl.code AS classe,
  v.code,
  v.description,
  v.notes,
  v.create_date,
  v.created_by,
  v.change_date,
  v.changed_by
FROM
  (
    (
      (
        sgs_salle_classe v
        LEFT JOIN sgs_ecole eco ON ((eco.id = v.ecole_id))
      )
      LEFT JOIN tg_annee_scolaire ann ON ((ann.id = v.annee_scolaire_id))
    )
    LEFT JOIN tg_classe cl ON ((cl.id = v.classe_id))
  );