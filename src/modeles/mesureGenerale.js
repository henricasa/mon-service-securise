const Mesure = require('./mesure');
const { ErreurMesureInconnue } = require('../erreurs');

class MesureGenerale extends Mesure {
  constructor(donneesMesure, referentiel, rendueIndispensable = false) {
    super({
      proprietesAtomiquesRequises: ['id', 'statut'],
      proprietesAtomiquesFacultatives: ['modalites'],
    });

    MesureGenerale.valide(donneesMesure, referentiel);
    this.renseigneProprietes(donneesMesure);

    this.rendueIndispensable = rendueIndispensable;
    this.referentiel = referentiel;
  }

  donneesReferentiel() {
    return this.referentiel.mesures()[this.id];
  }

  descriptionMesure() {
    return this.donneesReferentiel().description;
  }

  estIndispensable() {
    return !!this.donneesReferentiel().indispensable || this.rendueIndispensable;
  }

  estRecommandee() {
    return !this.estIndispensable();
  }

  nonRetenue() {
    return this.statut === Mesure.STATUT_NON_RETENU;
  }

  statutRenseigne() {
    return Mesure.statutRenseigne(this.statut);
  }

  static valide({ id, statut }, referentiel) {
    super.valide({ statut }, referentiel);

    const identifiantsMesuresRepertoriees = referentiel.identifiantsMesures();
    if (!identifiantsMesuresRepertoriees.includes(id)) {
      throw new ErreurMesureInconnue(`La mesure "${id}" n'est pas répertoriée`);
    }
  }
}

module.exports = MesureGenerale;
