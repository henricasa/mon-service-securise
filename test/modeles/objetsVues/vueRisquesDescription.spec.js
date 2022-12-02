const expect = require('expect.js');

const Homologation = require('../../../src/modeles/homologation');
const Referentiel = require('../../../src/referentiel');
const VueRisquesDescription = require('../../../src/modeles/objetsVues/vueRisquesDescription');

describe("L'objet de vue des descriptions des risques", () => {
  const homologation = new Homologation({
    id: '123',
    idUtilisateur: '456',
    descriptionService: { nomService: 'Nom Service' },
  });

  describe('ajoute les informations des niveaux de gravité', () => {
    const donneesReferentiel = {
      niveauxGravite: {
        nonConcerne: {
          position: 0,
          couleur: 'blanc',
          description: 'Non concerné',
          descriptionLongue: '',
          nonConcerne: true,
        },
        grave: {
          position: 3,
          couleur: 'orange',
          description: 'Grave',
          descriptionLongue: 'Niveaux de gravité grave',
        },
        critique: {
          position: 4,
          couleur: 'rouge',
          description: 'Critique',
          descriptionLongue: 'Niveaux de gravité critique',
        },
      },
    };

    let donnees;

    beforeEach(() => {
      const vueRisquesDescription = new VueRisquesDescription(
        homologation, Referentiel.creeReferentiel(donneesReferentiel)
      );
      donnees = vueRisquesDescription.donnees();
    });

    it('provenant du référentiel', () => {
      expect(donnees).to.have.key('niveauxGravite');
      expect(donnees.niveauxGravite).to.contain(donneesReferentiel.niveauxGravite.critique);
    });

    it('ignorant le niveaux de gravité non concerné', () => {
      expect(donnees.niveauxGravite.length).to.equal(2);
      expect(donnees.niveauxGravite.map((niveaux) => niveaux.description)).to.not.contain('Non concerné');
    });

    it('triant les niveaux de gravité par position décroissante', () => {
      const positions = donnees.niveauxGravite.map((niveaux) => niveaux.position);
      expect(positions[0]).to.equal(4);
      expect(positions[1]).to.equal(3);
    });
  });

  it('ajoute le nom du service', () => {
    const vueRisquesDescription = new VueRisquesDescription(homologation);

    const donnees = vueRisquesDescription.donnees();

    expect(donnees).to.have.key('nomService');
    expect(donnees.nomService).to.equal('Nom Service');
  });
});
