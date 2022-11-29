exports.up = (knex) => knex('autorisations')
  .then((lignes) => {
    const ajouts = lignes
      .map(({ id, donnees }) => {
        donnees.idService = donnees.idHomologation;
        return knex('autorisations').where({ id }).update({ donnees });
      });

    return Promise.all(ajouts);
  });

exports.down = (knex) => knex('autorisations')
  .then((lignes) => {
    const suppressions = lignes
      .map(({ id, donnees: { idService, ...autresDonnees } }) => knex('autorisations')
        .where({ id })
        .update({ donnees: autresDonnees }));

    return Promise.all(suppressions);
  });
