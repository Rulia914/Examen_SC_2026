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
    const createMonster = await DB.create(monster);
    const newMonster = new Monster(createMonster);
    this.monsters.push(newMonster);
    this.listDomElt.append(newMonster.render());
    this.renderMonstersCount();
  }

  // Supprime le monstre de l'API et de la collection, puis actualise le compteur.
  async deleteOneById(id) {
    const resp = await DB.deleteOneById(id);
    this.monsters.splice(
      this.monsters.findIndex((monster) => (monster.id === id)),
      1,
    );
    // Retire la première ligne affichée après la suppression.
    this.domElt.querySelector(`.monster-row`).remove();
    this.renderMonstersCount();
  }

  // Branche les événements du formulaire et des boutons de toutes les lignes.
  initEvents() {
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
        this.deleteOneById(monster.id);
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
