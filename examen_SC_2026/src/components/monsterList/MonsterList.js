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
    this.listDomElt = this.domElt.querySelector(".monster-list");
    this.monsters.forEach((monster) => monster.render(this.domElt));
    this.renderMonstersCount();
    this.initEvents();
  }
  async addMonster(monster) {
                // `monster` est la donnée reçue en argument (ici, actuellement, la valeur du champ).
                // Envoie cette donnée à l'API et attend que la création soit terminée.
                // `createMonster` contient l'objet renvoyé par l'API, généralement avec son identifiant.
    const createMonster = await DB.create(monster);
                // Transforme l'objet renvoyé par l'API en instance de la classe Monster.
    const newMonster = new Monster(createMonster);
                // Ajoute cette instance au tableau conservé par cette liste.
    this.monsters.push(newMonster);
                // Cherche le tableau HTML des monstres dans le composant et ajoute la nouvelle ligne dedans.
    newMonster.render(this.domElt);
                // Met à jour le nombre affiché pour inclure le monstre ajouté.
    this.renderMonstersCount();
  }

  initEvents() {
    // Cherche dans le composant l'élément portant la classe ".new-monster".
    const form = this.domElt.querySelector(".new-monster");
    // En théorie, on écoute l'envoi du formulaire pour traiter tous ses champs ensemble.
    form.addEventListener("submit", async (e) => {
      // Empêche le navigateur de recharger la page à l'envoi du formulaire.
      e.preventDefault();

      // Lire les champs du formulaire
      const formData = new FormData(form);
      // Regroupe les valeurs sous forme d'objet pour que DB.create reçoive les quatre propriétés.
      const monster = {
        name: formData.get("monsterName"),
        type: formData.get("monsterType"),
        dangerLevel: Number(formData.get("dangerLevel")),
        year: Number(formData.get("monsterYear")),
      };
      await this.addMonster(monster);
      form.reset(); //pour vider le formulaire
    });
  }
}
