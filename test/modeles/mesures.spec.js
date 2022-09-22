const expect = require('expect.js');

const { A_COMPLETER } = require('../../src/modeles/informationsHomologation');
const Mesures = require('../../src/modeles/mesures');
const MesuresSpecifiques = require('../../src/modeles/mesuresSpecifiques');
const Referentiel = require('../../src/referentiel');

const elles = it;

describe('Les mesures liées à une homologation', () => {
  elles('agrègent des mesures spécifiques', () => {
    const mesures = new Mesures({ mesuresSpecifiques: [
      { description: 'Une mesure spécifique' },
    ] });

    expect(mesures.mesuresSpecifiques).to.be.a(MesuresSpecifiques);
  });

  elles('ont comme statut `A_COMPLETER` si les mesures spécifiques ont ce statut', () => {
    const mesures = new Mesures({
      mesuresGenerales: [],
      mesuresSpecifiques: [{ description: 'Une mesure spécifique' }],
    });

    expect(mesures.statutSaisie()).to.equal(A_COMPLETER);
  });

  elles('sont à completer si toutes les mesures nécessaires ne sont pas complétées', () => {
    const referentiel = Referentiel.creeReferentielVide();
    referentiel.identifiantsMesures = () => ['mesure 1', 'mesure 2'];

    const mesures = new Mesures({
      mesuresGenerales: [{ id: 'mesure 1', statut: 'fait' }],
      mesuresSpecifiques: [],
    }, referentiel);

    expect(mesures.statutSaisie()).to.equal(A_COMPLETER);
  });

  elles('délèguent le calcul statistique aux mesures générales', () => {
    let calculStatistiqueAppele = false;

    const mesures = new Mesures({}, Referentiel.creeReferentielVide(), ['id1', 'id2']);
    mesures.mesuresGenerales.statistiques = (identifiantsMesuresPersonnalisees) => {
      expect(identifiantsMesuresPersonnalisees).to.eql(['id1', 'id2']);
      calculStatistiqueAppele = true;
      return 'résultat';
    };

    const stats = mesures.statistiques();

    expect(calculStatistiqueAppele).to.be(true);
    expect(stats).to.equal('résultat');
  });

  elles("délèguent le calcul de l'indice cyber aux mesures générales", () => {
    const mesures = new Mesures({}, Referentiel.creeReferentielVide(), ['id1']);

    mesures.mesuresGenerales.statistiques = (identifiantsMesuresPersonnalisees) => {
      expect(identifiantsMesuresPersonnalisees).to.eql(['id1']);
      return { indiceCyber: () => 3.7 };
    };

    expect(mesures.indiceCyber()).to.equal(3.7);
  });

  elles('connaissent le nombre total de mesures générales', () => {
    const referentiel = Referentiel.creeReferentielVide();
    referentiel.identifiantsMesures = () => ['mesure 1', 'mesure 2'];

    const mesures = new Mesures({
      mesuresGenerales: [],
      mesuresSpecifiques: [],
    }, referentiel);

    expect(mesures.nombreTotalMesuresGenerales()).to.equal(2);
  });

  elles('connaissent le nombre total de mesures générales indispensables', () => {
    const referentiel = Referentiel.creeReferentiel({
      mesures: {
        mesure1: {
          indispensable: true,
        },
        mesure2: {
          indispensable: true,
        },
        mesure3: {},
      },
    });
    referentiel.identifiantsMesures = () => ['mesure1', 'mesure3'];

    const mesures = new Mesures({
      mesuresGenerales: [],
      mesuresSpecifiques: [],
    }, referentiel);

    expect(mesures.nombreTotalMesuresGeneralesIndispensables()).to.equal(1);
  });
});
