var RM = RM || {};

(function (racine) {
  const identifiantPage = function () {
    const main = document.getElementsByTagName("main")[0];
    return main.id;
  };

  const creePageAccueil = function () {
    const main = document.getElementsByTagName("main")[0];
    main.innerHTML = `
  <div class="intro">
    <h1>Homologuer mon service et suivre la sécurité en continu</h1>
    <p>
      Un outil simple et rapide pour aider à la protection et à l'homologation
      RGS de mon service numérique
    </p>

    <a href="/demarrage_saisie.html">Démarrer mon homologation ></a>
  </div>

  <div class="informations-complementaires">
    <h2>Comment ça marche ?</h2>
    <ul class="etape-comment-ca-marche">
      <li>Identifier les risques et les mesures de sécurité</li>
      <li>Gérer l'homologation de sécurité RGS</li>
      <li>Suivez la sécurité de votre service en continu</li>
    </ul>
  </div>
    `;
  };

  const creePageDemarrageSaisie = function () {
    const main = document.getElementsByTagName("main")[0];
    main.innerHTML = `
<div class="entete">
  <div class="titre">
    <h2>Créer un nouveau dossier d'homologation</h2>
    <h3>
      Vous pouvez renseigner ici quelques premières informations, qui pourront
      vous aider pour la suite de la saisie.
      </h3>
  </div>
  <a href="/saisie.html">Passer cette étape</a>
</div>
<div class="question">
  <label for="nom-service">Appellation du service</label>
  <input id="nom-service" type="text">
</div>
<div class="question">
  <div>Type du service</div>
  <input id="type-service-1" name="type-service" type="radio" value="Site internet">
  <label for="type-service-1">Site internet</label><br/>
  <input id="type-service-1" name="type-service" type="radio" value="Application mobile">
  <label for="type-service-1">Application mobile</label><br/>
  <input id="type-service-1" name="type-service" type="radio" value="API">
  <label for="type-service-1">API</label><br/>
</div>
<div class="question">
  <div>Type d'utilisateurs</div>
  <input id="type-utilisateurs-1" type="checkbox" value="Visiteurs sans compte">
  <label for="type-utilisateurs-1">Visiteurs sans compte</label><br/>
  <input id="type-utilisateurs-1" type="checkbox" value="Visiteurs avec un compte">
  <label for="type-utilisateurs-1">Visiteurs avec un compte</label><br/>
  <input id="type-utilisateurs-1" type="checkbox" value="Administrateurs">
  <label for="type-utilisateurs-1">Administrateurs</label><br/>
  <input id="type-utilisateurs-1" type="checkbox" value="Autre">
  <label for="type-utilisateurs-1">Autre</label><br/>
</div>
<div class="question">
  <div>Type du service</div>
  <input id="avancement-service-1" name="avancement-service" type="radio" value="Le service n'est pas encore développé">
  <label for="avancement-service-1">Le service n'est pas encore développé</label><br/>
  <input id="avancement-service-1" name="avancement-service" type="radio" value="Le service est en cours de développement">
  <label for="avancement-service-1">Le service est en cours de développement</label><br/>
  <input id="avancement-service-1" name="avancement-service" type="radio" value="Le service est en ligne">
  <label for="avancement-service-1">Le service est en ligne</label><br/>
</div>
<div class="pied">
  <a href="/saisie.html">Continuer</a>
</div>
    `;
  };

  const demarre = function () {
    const menacesSelectionnees = [];
    const mesuresSelectionnees = [];

    RM.ajouteEntete();

    const idPage = identifiantPage();
    if (idPage === "page-accueil") { creePageAccueil() }
    if (idPage === "page-demarrage-saisie") { creePageDemarrageSaisie() }

    if (idPage === "") {
      RM.creeOnglets([
        { id: "risques", titre: "J'évalue les risques" },
        { id: "mesures", titre: "Je me protège" },
        { id: "recapitulatif", titre: "Synthèse" }
      ]);

      RM.ajouteConteneurRisquesDansOnglet("risques", menacesSelectionnees);
      RM.ajouteConteneurMesuresDansOnglet("mesures", menacesSelectionnees, mesuresSelectionnees);
      RM.ajouteConteneurRecapitulatifDansOnglet("recapitulatif", menacesSelectionnees, mesuresSelectionnees);
      RM.selectionneOnglet("risques");
    }

    RM.ajoutePiedPage();
  };

  racine.demarre = demarre;
})(RM);
