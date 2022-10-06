const ajusteHauteurMesure = (selecteurStatut, $typeMesures, totalMesures) => {
  const $statut = $(selecteurStatut, $typeMesures);
  const mesuresFaites = $statut.text();
  const hauteurFaites = (mesuresFaites / totalMesures) * 100;
  $statut.css('width', `${hauteurFaites}%`);
};

const diagramBatonMesures = (selecteurconteneur) => {
  const $typeMesures = $(selecteurconteneur);
  const total = $typeMesures.data('total');
  const mesuresPresentes = $('.statut-mesure:not(:empty)', $typeMesures).length;
  const autresMesuresPresentes = mesuresPresentes ? mesuresPresentes - 1 : 0;
  $('.statut-mesure', $typeMesures).css('max-width', `calc(100% - ${autresMesuresPresentes * 1.2}em)`);
  ['.fait', '.en-cours', '.non-fait'].forEach((selecteurStatut) => ajusteHauteurMesure(selecteurStatut, $typeMesures, total));
};

export default diagramBatonMesures;
