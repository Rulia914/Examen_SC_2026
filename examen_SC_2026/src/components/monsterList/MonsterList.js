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
    //Ajouter un monstre

    // Cherche dans le composant l'élément portant la classe ".new-monster".
    const form = this.domElt.querySelector(".new-monster");
    console.log(form);
    // En théorie, on écoute l'envoi du formulaire pour traiter tous ses champs ensemble.
    form.addEventListener("submit", async (e) => {
      // Empêche le navigateur de recharger la page à l'envoi du formulaire.
      e.preventDefault();
      // Lire les champs du formulaire
      const formData = new FormData(form);
      // Crée l'objet de données attendu par l'API à partir des champs du formulaire.
      const monster = new Monster({
        name: formData.get("monsterName"),
        type: formData.get("monsterType"),
        dangerLevel: Number(formData.get("dangerLevel")),
        year: Number(formData.get("monsterYear")),
      });

      await this.addMonster(monster);
      form.reset();
    });

    //Supprimer un monstre

    // Ajoute un seul écouteur de clic sur la liste des monstres.
    this.listDomElt.addEventListener("click", (e) => {
      // Cherche le bouton concerné, même si le clic est sur son icône.
      const button = e.target.closest("button");
      // Arrête le traitement si le clic n'était pas sur un bouton.
      if (!button) return;

      // Remonte du bouton jusqu'à la ligne du monstre.
      const row = button.closest(".monster-row");
      // Arrête le traitement si le bouton n'est pas dans une ligne de monstre.
      if (!row) return;

      // Cherche dans le tableau l'objet Monster qui possède cette ligne HTML.
      const monster = this.monsters.find((item) => item.domElt === row);
      // Arrête le traitement si aucun objet Monster ne correspond à cette ligne.
      if (!monster) return;

      // Récupère l'identifiant depuis l'objet Monster.
      const id = monster.id;

      // Vérifie que le bouton cliqué est bien le bouton Delete du template.
      if (button.classList.contains("btn-delete")) {
        // Demande à la liste de supprimer ce monstre par son identifiant.
        this.deleteOneById(id);
      }

      // Plus tard, les boutons Edit et Validate pourront être traités ici aussi.
    });
  }
}
