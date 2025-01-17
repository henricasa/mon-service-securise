exports.up = (knex) => knex('homologations')
  .then((lignes) => {
    const misesAJour = lignes
      .filter(({ donnees }) => donnees.partiesPrenantes)
      .map(({ id, donnees: { partiesPrenantes, ...autresDonnees } }) => knex('homologations')
        .where({ id })
        .update({ donnees: {
          partiesPrenantes, rolesResponsabilites: partiesPrenantes, ...autresDonnees,
        } }));
    return Promise.all(misesAJour);
  });

exports.down = (knex) => knex('homologations')
  .then((lignes) => {
    const misesAJour = lignes
      .filter(({ donnees }) => donnees.rolesResponsabilites)
      .map(({ id, donnees: { rolesResponsabilites: _, ...autresDonnees } }) => knex('homologations')
        .where({ id })
        .update({ donnees: { ...autresDonnees } }));
    return Promise.all(misesAJour);
  });
