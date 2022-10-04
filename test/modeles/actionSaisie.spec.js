const expect = require('expect.js');

const ActionSaisie = require('../../src/modeles/actionSaisie');
const Homologation = require('../../src/modeles/homologation');
const InformationsHomologation = require('../../src/modeles/informationsHomologation');

const {
  ErreurIdentifiantActionSaisieInvalide,
  ErreurIdentifiantActionSaisieManquant,
  ErreurVersionActionSaisieManquante,
} = require('../../src/erreurs');
const Referentiel = require('../../src/referentiel');

describe('Une action de saisie', () => {
  it('connaît son identifiant', () => {
    const referentiel = Referentiel.creeReferentiel({ actionsSaisie: { v1: { uneAction: {} } } });

    const action = new ActionSaisie({ id: 'uneAction', version: 'v1' }, referentiel);
    expect(action.id).to.equal('uneAction');
  });

  it('connaît sa description', () => {
    const referentiel = Referentiel.creeReferentiel({
      actionsSaisie: {
        v1: { uneAction: { description: 'Une description' } },
      },
    });

    const action = new ActionSaisie({ id: 'uneAction', version: 'v1' }, referentiel);
    expect(action.description()).to.equal('Une description');
  });

  it("connaît l'identifiant de l'action suivante", () => {
    const referentiel = Referentiel.creeReferentiel({
      actionsSaisie: {
        v1: { uneAction: { position: 0 }, actionSuivante: { position: 1 } },
      },
    });

    const action = new ActionSaisie({ id: 'uneAction', version: 'v1' }, referentiel);
    expect(action.suivante()).to.equal('actionSuivante');
  });

  it('connaît sa version', () => {
    const referentiel = Referentiel.creeReferentiel({ actionsSaisie: { v1: { uneAction: {} } } });

    const action = new ActionSaisie({ version: 'v1', id: 'uneAction' }, referentiel);
    expect(action.version).to.equal('v1');
  });

  it('sait se décrire comme un objet JSON', () => {
    const referentiel = Referentiel.creeReferentiel({
      actionsSaisie: {
        v1: { uneAction: { position: 0, description: 'Une description' } },
      },
    });

    const homologation = new Homologation({});
    homologation.statutSaisie = () => InformationsHomologation.A_SAISIR;

    const action = new ActionSaisie({ id: 'uneAction', version: 'v1' }, referentiel, homologation);
    expect(action.toJSON()).to.eql({
      id: 'uneAction',
      description: 'Une description',
      statut: InformationsHomologation.A_SAISIR,
    });
  });

  it("exige la présence que l'identifiant soit renseigné", (done) => {
    try {
      new ActionSaisie();
      done("La création de l'action de saisie aurait dû lever une erreur");
    } catch (e) {
      expect(e).to.be.a(ErreurIdentifiantActionSaisieManquant);
      expect(e.message).to.equal("L'identifiant d'action de saisie doit être renseigné");
      done();
    }
  });

  it("vérifie la validité de l'identifiant", (done) => {
    try {
      new ActionSaisie({ id: 'actionInvalide', version: 'v1' });
      done("La création de l'action de saisie aurait dû lever une erreur");
    } catch (e) {
      expect(e).to.be.a(ErreurIdentifiantActionSaisieInvalide);
      expect(e.message).to.equal("L'action de saisie \"actionInvalide\" est invalide");
      done();
    }
  });

  it('exige la présence de la version', (done) => {
    try {
      new ActionSaisie({ id: 'uneAction' });
      done("La création de l'action de saisie aurait dû lever une erreur");
    } catch (e) {
      expect(e).to.be.a(ErreurVersionActionSaisieManquante);
      expect(e.message).to.equal("La version d'action de saisie doit être renseignée");
      done();
    }
  });
});
