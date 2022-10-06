import diagramBatonMesures from './diagramBatonMesures.js';
import graphiqueCamembert from '../modules/graphiqueCamembert.js';
import telechargementPdf from '../modules/interactions/telechargementPdf.js';

$(() => {
  graphiqueCamembert('indispensables', '.indispensables');
  graphiqueCamembert('recommandees', '.recommandees');
  ['.gouvernance', '.protection', '.resilience', '.defense'].forEach((categorie) => diagramBatonMesures(categorie));

  $('#telecharger').on('click', telechargementPdf('syntheseSecurite.pdf'));
});
