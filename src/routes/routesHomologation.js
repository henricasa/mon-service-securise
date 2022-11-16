const express = require('express');
const { decode } = require('html-entities');
const fsPromises = require('fs/promises');
const pdflatex = require('node-pdflatex').default;

const ActionsSaisie = require('../modeles/actionsSaisie');
const Homologation = require('../modeles/homologation');
const InformationsHomologation = require('../modeles/informationsHomologation');
const moteurModeleParDefaut = require('../moteurs/moteurModele');

const echappeCaracteresSpeciauxLatex = (texte) => texte.replaceAll('&', '\\&');

const latexPdf = ({ confectionne }) => ({
  genere: (urlSource, donneesAInjecter) => fsPromises.readFile(urlSource)
    .then((donneesFichier) => {
      const pdfConfectionne = confectionne(donneesFichier.toString(), donneesAInjecter);
      return pdflatex(pdfConfectionne);
    }),
});

const routesHomologation = (
  middleware, referentiel, moteurRegles, moteurModele = moteurModeleParDefaut
) => {
  const routes = express.Router();

  routes.get('/creation', middleware.verificationAcceptationCGU, (_requete, reponse) => {
    const homologation = new Homologation({});
    reponse.render('homologation/creation', { referentiel, homologation });
  });

  const donneesActionsSaisie = (version, homologation) => (
    new ActionsSaisie(version, referentiel, homologation)
      .toJSON()
      .map(({ id, ...autresDonnees }) => (
        { url: `/homologation/${homologation.id}/${id}`, id, ...autresDonnees }
      ))
  );

  routes.get('/:id', middleware.trouveHomologation, (requete, reponse) => {
    const { homologation } = requete;
    const version = process.env.AVEC_SYNTHESE_V2 ? 'v2' : 'v1';

    const actionsSaisie = donneesActionsSaisie(version, homologation);
    const paramsRequete = { referentiel, actionsSaisie, InformationsHomologation };

    if (process.env.AVEC_SYNTHESE_V2) {
      reponse.render('homologation/synthese', { service: homologation, ...paramsRequete });
    } else {
      reponse.render('homologation', { homologation, ...paramsRequete });
    }
  });

  routes.get('/:id/decision',
    middleware.trouveHomologation,
    middleware.positionneHeadersAvecNonce,
    (requete, reponse) => {
      const { homologation, nonce } = requete;
      reponse.render('homologation/decision', { homologation, referentiel, nonce });
    });

  routes.get('/:id/syntheseSecurite',
    middleware.trouveHomologation,
    (requete, reponse) => {
      const { homologation } = requete;
      reponse.render('homologation/syntheseSecurite', { homologation, referentiel });
    });

  routes.get('/:id/syntheseSecurite/annexes/mesures',
    middleware.trouveHomologation,
    (requete, reponse) => {
      const { homologation } = requete;
      reponse.render('homologation/annexes/mesures', { homologation, referentiel });
    });

  routes.get('/:id/syntheseSecurite/annexesMesures.pdf',
    middleware.trouveHomologation,
    (requete, reponse, suite) => {
      const { homologation } = requete;
      const statuts = { enCours: 'En cours', nonFait: 'Non fait', fait: 'Fait' };
      const donneesMisesEnForme = homologation.mesuresParStatut(
        decode, echappeCaracteresSpeciauxLatex
      );
      const latexPdfGenerateur = latexPdf(moteurModele);
      const donneesAInjecter = { statuts, mesuresParStatut: donneesMisesEnForme };
      latexPdfGenerateur.genere('src/vuesTex/annexesMesures.template.tex', donneesAInjecter)
        .then((pdf) => {
          reponse.contentType('application/pdf');
          reponse.send(pdf);
        })
        .catch(suite);
    });

  routes.get('/:id/descriptionService', middleware.trouveHomologation, (requete, reponse) => {
    const { homologation } = requete;
    reponse.render('homologation/descriptionService', { referentiel, homologation });
  });

  routes.get('/:id/mesures', middleware.trouveHomologation, (requete, reponse) => {
    const { homologation } = requete;
    const mesures = moteurRegles.mesures(homologation.descriptionService);
    reponse.render('homologation/mesures', { referentiel, homologation, mesures });
  });

  routes.get('/:id/rolesResponsabilites', middleware.trouveHomologation, (requete, reponse) => {
    const { homologation } = requete;
    reponse.render('homologation/rolesResponsabilites', { homologation });
  });

  routes.get('/:id/risques', middleware.trouveHomologation, (requete, reponse) => {
    const { homologation } = requete;
    reponse.render('homologation/risques', { referentiel, homologation });
  });

  routes.get('/:id/avisExpertCyber', middleware.trouveHomologation, (requete, reponse) => {
    const { homologation } = requete;
    reponse.render('homologation/avisExpertCyber', { referentiel, homologation });
  });

  return routes;
};

module.exports = routesHomologation;
