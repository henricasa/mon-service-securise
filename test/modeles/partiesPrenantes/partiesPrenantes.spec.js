const expect = require('expect.js');

const PartiesPrenantes = require('../../../src/modeles/partiesPrenantes/partiesPrenantes');

const elles = it;

describe('Les parties prenantes', () => {
  elles('savent se décrire en JSON', () => {
    const partiesPrenantes = new PartiesPrenantes(
      { partiesPrenantes: [{ type: 'Hebergement', nom: 'hébergeur' }] }
    );

    expect(partiesPrenantes.toJSON()).to.eql([{ type: 'Hebergement', nom: 'hébergeur' }]);
  });

  elles("savent transmettre l'hébergement", () => {
    const partiesPrenantes = new PartiesPrenantes(
      { partiesPrenantes: [{ type: 'Hebergement', nom: 'hébergeur' }] }
    );

    expect(partiesPrenantes.hebergement()).to.eql({ type: 'Hebergement', nom: 'hébergeur' });
  });

  elles('savent transmettre les informations du développement et fourniture du service', () => {
    const partiesPrenantes = new PartiesPrenantes(
      { partiesPrenantes: [{ type: 'DeveloppementFourniture', nom: 'structure' }] }
    );

    expect(partiesPrenantes.developpementFourniture()).to.eql({ type: 'DeveloppementFourniture', nom: 'structure' });
  });

  elles('savent transmettre la maintenance du service', () => {
    const partiesPrenantes = new PartiesPrenantes(
      { partiesPrenantes: [{ type: 'MaintenanceService', nom: 'mainteneur' }] }
    );

    expect(partiesPrenantes.maintenanceService()).to.eql({ type: 'MaintenanceService', nom: 'mainteneur' });
  });

  elles('savent transmettre la sécurité du service', () => {
    const partiesPrenantes = new PartiesPrenantes(
      { partiesPrenantes: [{ type: 'SecuriteService', nom: 'Structure supervision' }] }
    );

    expect(partiesPrenantes.securiteService()).to.eql({ type: 'SecuriteService', nom: 'Structure supervision' });
  });

  elles('savent transmettre les parties prenantes spécifiques', () => {
    const partiesPrenantes = new PartiesPrenantes(
      { partiesPrenantes: [
        { type: 'PartiePrenanteSpecifique', nom: 'une partie' },
        { type: 'PartiePrenanteSpecifique', nom: 'une autre partie' },
      ] }
    );

    expect(partiesPrenantes.specifiques()).to.have.length(2);
    expect(partiesPrenantes.specifiques()[0]).to.eql({ type: 'PartiePrenanteSpecifique', nom: 'une partie' });
  });

  elles('donnent la liste des propriétés de la partie prenante', () => {
    expect(PartiesPrenantes.proprietesItem()).to.eql(['nom', 'natureAcces', 'pointContact']);
  });
});
