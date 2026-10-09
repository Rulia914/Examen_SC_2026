import DB from "../../DB";
import Monster from "../Monster/Monster";
import getTemplate from "./template";

export default class MonsterList {
  constructor(data) {
    this.domElt = document.querySelector(data.el);
    this.listDomElt = null;
    DB.setApiURL(data.apiURL);
    this.monsters = [];
    this.loadMonsters(); //pour charger les todos
  }
  async loadMonsters() {
    const monsters = await DB.findAll();
    this.monsters = monsters.map((monster) => new Monster(monster));
    this.render();
  }
  getMonstersCount() {
    return this.monsters.length;
  }

  renderMonstersCount() {
    this.domElt.querySelector(".monster-count").innerText =
      this.getMonstersCount();
  }

  render() {
    this.domElt.innerHTML = getTemplate();
    this.listDomElt = this.domElt.querySelector(".monsters-list");
    this.monsters.forEach((monster) => monster.render(this.listDomElt));
    this.renderMonstersCount();
    this.initEvents();
  }
  async addMonster(monster) {
    // Envoie à l'API uniquement les données saisies et attend sa réponse.
    const createMonster = await DB.create(monster);
    // Transforme l'objet renvoyé par l'API en instance de Monster.
    const newMonster = new Monster(createMonster);
    this.monsters.push(newMonster);
    // Ajoute la nouvelle ligne dans le tbody de la liste.
    newMonster.render(this.listDomElt);
    this.renderMonstersCount();
  }

  async deleteOneById(id) {
    //Supprimer de la DB
    const resp = await DB.deleteOneById(id);
    //Supprimer des monsters
    this.monsters.splice(
      this.monsters.findIndex((monster) => (monster.id === id)),
      1,
    );
    //supprimer du dom
    this.domElt.querySelector(`.monster-row`).remove();
    //relancer le render()
    this.renderMonstersCount();
  }

  initEvents() {
    // Formulaire d'ajout d'un monstre
    const form = this.domElt.querySelector(".new-monster");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
  
      const monster = new Monster({
        name: formData.get("monsterName"),
        type: formData.get("monsterType"),
        dangerLevel: Number(formData.get("dangerLevel")),
        year: Number(formData.get("monsterYear")),
      });
  
      await this.addMonster(monster);
      form.reset();
    });
  
    // Gestion des clics sur la liste (Délégation d'événements)
    this.listDomElt.addEventListener("click", async (e) => {
      // 1. Détection du bouton : cherche le bouton <button> le plus proche de l'élément cliqué (gère le clic sur l'icône <i> à l'intérieur)
      const button = e.target.closest("button");
      if (!button) return; // Interrompt l'exécution si le clic n'a pas eu lieu sur un bouton
    
      // 2. Identification de la ligne : remonte du bouton vers la ligne <tr> correspondante du tableau
      const row = button.closest(".monster-row");
      if (!row) return; // Interrompt l'exécution si le bouton n'appartient pas à une ligne du tableau
    
      // 3. Liaison DOM -> Instance JS : recherche dans le tableau `monsters` l'objet Monster associé à cette ligne HTML
      const monster = this.monsters.find((item) => item.domElt === row);
      if (!monster) return; // Interrompt l'exécution si aucune instance JS ne correspond au nœud DOM
    
      // 4. Action de suppression : si le bouton possède la classe CSS ".btn-delete"
      if (button.classList.contains("btn-delete")) {
        // Appelle la méthode du composant parent pour supprimer le monstre via son ID dans la DB et dans le DOM
        this.deleteOneById(monster.id);
      }
    
      // 5. Action d'édition : si le bouton possède la classe CSS ".btn-edit"
      if (button.classList.contains("btn-edit")) {
        // Bascule l'instance en mode édition (ajoute la classe CSS .isEditing sur la ligne)
        console.log("Clic détecté sur le bouton check pour le monstre :", monster.id);
        await monster.edit();
      }
    
      // 6. Action de validation : si le bouton possède la classe CSS ".btn-check"
      if (button.classList.contains("btn-check")) {
        // Exécute la sauvegarde asynchrone (envoie le PATCH à l'API, met à jour l'instance, rafraîchit l'affichage et retire la classe .isEditing)
        await monster.saveUpdate();
      }
    });
  }
}
