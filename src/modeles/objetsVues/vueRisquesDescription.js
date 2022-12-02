const Referentiel = require('../../referentiel');

class VueRisquesDescription {
  constructor(homologation, referentiel = Referentiel.creeReferentielVide()) {
    this.referentiel = referentiel;
    this.homologation = homologation;
  }

  donnees() {
    return {
      niveauxGravite: this.referentiel.infosNiveauxGraviteConcernes(true),
      nomService: this.homologation.nomService(),
    };
  }
}

module.exports = VueRisquesDescription;
