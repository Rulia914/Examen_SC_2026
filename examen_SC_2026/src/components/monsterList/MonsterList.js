import DB from "../../DB";
import Monster from "../Monster/Monster";
import getTemplate from "./template";

// Gère la collection de monstres, son affichage et les actions de la liste.
export default class MonsterList {
  constructor(data) {
    // Récupère le conteneur principal et prépare le conteneur de la liste.
    this.domElt = document.querySelector(data.el);
    this.listDomElt = null;
    // Configure l'URL de l'API avant de charger les monstres.
    DB.setApiURL(data.apiURL);
    this.monsters = [];
    this.loadMonsters();
  }

  // Trie les monstres selon la colonne cliquée et inverse l'ordre si on clique deux fois === Réalisé avec l'aide de l'agent J'y arrive pas ;)
  sortMonsters(param) {
    // 1. Initialisation de l'état du tri si ce n'est pas encore fait.
    // On mémorise quelle colonne a été triée et dans quel sens (croissant/décroissant).
    if (!this.lastSort) {
      this.lastSort = { column: null, smallToLarg: true };
    }

    // 2. Gestion de l'alternance du sens de tri :
    // Si l'utilisateur clique sur la même colonne, on inverse le sens. 
    // S'il clique sur une nouvelle colonne, on réinitialise le tri en mode croissant (du plus petit au plus grand).
    if (this.lastSort.column === param) {
      this.lastSort.smallToLarg = !this.lastSort.smallToLarg;
    } else {
      this.lastSort.column = param;
      this.lastSort.smallToLarg = true;
    }

    // Définition du multiplicateur (1 pour un tri croissant, -1 pour inverser et trier en décroissant).
    const sortDirection = this.lastSort.smallToLarg ? 1 : -1;

    // 3. Synchronisation de la source de vérité : 
    // On trie directement le tableau de données principal (this.monsters) pour que l'ordre métier en mémoire corresponde exactement à l'ordre visuel, évitant ainsi toute désynchronisation.
    this.monsters = [...this.monsters].sort((a, b) => {
      // Si la propriété est du texte (ex: nom, type), on utilise localeCompare pour un tri alphabétique propre.
      if (typeof a[param] === "string") {
        return a[param].localeCompare(b[param]) * sortDirection;
      }
      // Sinon, s'il s'agit d'un nombre (ex: dangerLevel, year), on effectue une soustraction mathématique classique.
      return (a[param] - b[param]) * sortDirection;
    });

    // 4. Mise à jour performante du DOM sans destruction des éléments :
    // Au lieu de vider le conteneur avec innerHTML = "" (ce qui détruirait les nœuds DOM et les états en cours),
    // on parcourt le tableau trié et on déplace dynamiquement les lignes existantes (domElt) une à une 
    // à la fin du tbody. Le navigateur réordonne les éléments instantanément.
    const tbody = this.domElt.querySelector(".monsters-table tbody");
    if (tbody) {
      this.monsters.forEach((monster) => {
        tbody.appendChild(monster.domElt);
      });
    }
  }

  // Charge les monstres depuis l'API, puis prépare leur affichage.
  async loadMonsters() {
    const monsters = await DB.findAll();
    this.monsters = monsters.map((monster) => new Monster(monster));
    this.render();
  }

  // Retourne le nombre de monstres actuellement en mémoire.
  getMonstersCount() {
    return this.monsters.length;
  }

  // Affiche le nombre de monstres dans le compteur de la page.
  renderMonstersCount() {
    this.domElt.querySelector(".monster-count").innerText =
      this.getMonstersCount();
  }

  // Reconstruit le gabarit de la liste et affiche chaque monstre.
  render() {
    this.domElt.innerHTML = getTemplate();
    this.listDomElt = this.domElt.querySelector(".monsters-list");
    this.monsters.forEach((monster) => this.listDomElt.append(monster.render()));
    this.renderMonstersCount();
    this.initEvents();
  }

  // Crée le monstre dans l'API, puis l'ajoute à la liste affichée.
  async addMonster(monster) {
    const createdMonster = await DB.create(monster);
    const newMonster = new Monster(createdMonster);
    this.monsters.push(newMonster);
    this.listDomElt.append(newMonster.render());
    this.renderMonstersCount();
  }

  // Supprime le monstre de l'API et de la collection, puis actualise le compteur.
  async deleteOneById(id) {
    const monster = this.monsters.find((item) => item.id === id);
  
    await DB.deleteOneById(id);
  
    this.monsters.splice(this.monsters.indexOf(monster), 1);
    monster.domElt.remove();
    this.renderMonstersCount();
  }
  // Branche les événements du formulaire et des boutons de toutes les lignes.
  initEvents() {
    // --- GESTION DU TRI PAR COLONNE ---   === Réalisé avec l'aide de l'agent J'y arrive pas ;)
    // On écoute les clics sur l'ensemble du conteneur pour intercepter les liens d'en-tête possédant un "name"
    this.domElt.addEventListener("click", (e) => {
      console.log("Clic détecté sur :", e.target);
      const lienTri = e.target.closest("a[name]");
      if (lienTri) {
        e.preventDefault(); // Empêche le lien de sauter en haut de page
        const param = lienTri.getAttribute("name"); // Récupère le critère (ex: "name", "dangerLevel", etc.)
        this.sortMonsters(param); // Appelle ta fonction de tri
      }
    });
    //Recherche
    const searchInput = this.domElt.querySelector(".search");
    if (searchInput) {
      // 2. On écoute chaque frappe au clavier
      searchInput.addEventListener("input", (e) => {
        // A. On récupère le texte saisi en minuscules
        const termeSaisi = e.target.value.toLowerCase().trim();

        // B. On filtre le tableau this.monsters
        const monstresFiltres = this.monsters.filter((monster) => {
          const nom = monster.name.toLowerCase();
          const type = monster.type.toLowerCase();
          return nom.includes(termeSaisi) || type.includes(termeSaisi);
        });

        // C. On cible le tbody du tableau
        const tbody = this.domElt.querySelector(".monsters-table tbody");
        if (tbody) {
          // D. On vide l'affichage actuel
          tbody.innerHTML = "";

          // E. On réaffiche uniquement les lignes des monstres filtrés (sans tout recréer)
          monstresFiltres.forEach((monster) => {
            tbody.appendChild(monster.domElt);
          });
        }
      });

      }

    // Formulaire d'ajout d'un monstre
    const form = this.domElt.querySelector(".new-monster");
    form.addEventListener("submit", async (e) => {
      // Empêche le rechargement de la page lors de l'envoi du formulaire.
      e.preventDefault();
      // Lit les valeurs saisies dans le formulaire.
      const formData = new FormData(form);
  
      // Construit une instance à partir des données du formulaire.
      const monster = new Monster({
        name: formData.get("monsterName"),
        type: formData.get("monsterType"),
        dangerLevel: Number(formData.get("dangerLevel")),
        year: Number(formData.get("monsterYear")),
      });
  
      // Ajoute le nouveau monstre, puis vide les champs du formulaire.
      await this.addMonster(monster);
      form.reset();
    });
 
    // Gestion des clics sur la liste (Délégation d'événements)
    this.listDomElt.addEventListener("click", async (e) => {
      // Cherche le bouton même si le clic a été fait sur son icône.
      const button = e.target.closest("button");
      if (!button) return;
    
      // Retrouve la ligne du monstre à partir du bouton cliqué.
      const row = button.closest(".monster-row");
      if (!row) return;
    
      // Associe la ligne HTML à son instance Monster.
      const monster = this.monsters.find((item) => item.domElt === row);
      if (!monster) return;
    
      // Supprime le monstre correspondant au bouton Delete.
      if (button.classList.contains("btn-delete")) {
        await this.deleteOneById(monster.id);
      }
    
      // Passe la ligne en mode édition.
      if (button.classList.contains("btn-edit")) {
        console.log("Clic détecté sur le bouton check pour le monstre :", monster.id);
        await monster.edit();
      }
    
      // Enregistre les modifications saisies dans la ligne.
      if (button.classList.contains("btn-check")) {
        await monster.saveUpdate();
      }
      
    });
  }
}
