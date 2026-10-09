import DB from "../../DB";
import getTemplate from "./template";

export default class Monster {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.dangerLevel = data.dangerLevel;
    this.year = data.year;
    this.domElt = null;
  }

  render(el) {
    const template = document.createElement("template");
    template.innerHTML = getTemplate(this);
    this.domElt = template.content.firstElementChild;
    el.append(this.domElt);

    // Synchronise l'affichage initial pour corriger les valeurs en dur du template
    this.updateDOM();
  }

  // Applique les valeurs courantes de l'instance aux éléments du DOM
  updateDOM() {
    // 1. Mise à jour du nom
    // Cible le champ de saisie <input> du nom et y injecte la valeur de l'instance
    this.domElt.querySelector(".input-name").value = this.name;
    // Remonte jusqu'à la cellule <td> parente de l'input pour sélectionner l'élément <span> masqué (.isEditing-hidden) et y insérer le texte à afficher
    this.domElt.querySelector(".input-name").closest("td").querySelector(".isEditing-hidden").textContent = this.name;

    this.domElt.querySelector(".input-type").value = this.type;
    this.domElt.querySelector(".input-type").closest("td").querySelector(".isEditing-hidden").textContent = this.type;
// pourquoi le type s'efface alors qu'il faudrait qu'il reste durant la modification
    this.domElt.querySelector(".input-danger").value = this.dangerLevel;
    //je ne comprends pas ce qui suit
    const dangerSpan = this.domElt.querySelector(".input-danger").closest("td").querySelector(".isEditing-hidden");
    dangerSpan.textContent = this.dangerLevel;
    dangerSpan.title = this.dangerLevel;

    this.domElt.querySelector(".input-year").value = this.year;
    this.domElt.querySelector(".input-year").closest("td").querySelector(".isEditing-hidden").textContent = this.year;
  }
  // Active le mode édition (affiche les champs de saisie)
  edit() {
    this.domElt.classList.add("isEditing");
  }

  // Lit les champs, envoie l'update à l'API et rafraîchit l'instance
  async saveUpdate() {
    const updatedData = {
      name: this.domElt.querySelector(".input-name").value,
      type: this.domElt.querySelector(".input-type").value,
      dangerLevel: Number(this.domElt.querySelector(".input-danger").value),
      year: Number(this.domElt.querySelector(".input-year").value),
    };

    // 1. Mise à jour dans la DB
    const saved = await DB.updateOne(this.id, updatedData);

    // 2. Mise à jour de l'instance
    this.name = saved.name;
    this.type = saved.type;
    this.dangerLevel = saved.dangerLevel;
    this.year = saved.year;

    // 3. Synchronisation du DOM textuel
    this.updateDOM();

    // 4. Retrait de la classe CSS pour fermer le mode édition
    this.domElt.classList.remove("isEditing");
  }
}