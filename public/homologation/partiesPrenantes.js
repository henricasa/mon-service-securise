import arrangeParametresPartiesPrenantes from '../modules/arrangeParametresPartiesPrenantes.mjs';
import parametres from '../modules/parametres.mjs';
import brancheElementsAjoutables from '../modules/brancheElementsAjoutables.js';
import brancheOnglets from '../modules/interactions/brancheOnglets.mjs';

const tousLesParametres = (selecteurFormulaire) => {
  const params = parametres(selecteurFormulaire);

  arrangeParametresPartiesPrenantes(params);

  return params;
};

$(() => {
  brancheOnglets('#onglets-liens > a');

  brancheElementsAjoutables('acteurs-homologation', 'acteur-homologation', {
    role: { label: 'Rôle au regard du projet' },
    nom: { label: 'Nom / Prénom' },
    fonction: { label: 'Fonction' },
  });

  const $bouton = $('.bouton');
  const identifiantHomologation = $bouton.attr('identifiant');

  $bouton.on('click', () => {
    const params = tousLesParametres('form#parties-prenantes');

    axios.post(`/api/homologation/${identifiantHomologation}/partiesPrenantes`, params)
      .then((reponse) => (window.location = `/homologation/${reponse.data.idHomologation}`));
  });
});
