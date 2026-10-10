import DB from "../../DB";
import getTemplate from "./template";

// Représente un monstre et synchronise ses données avec sa ligne HTML.
export default class Monster {
  constructor(data) {
    //reçoit les données d’un monstre.
    //conserve les données reçues de l'API.
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.dangerLevel = data.dangerLevel;
    this.year = data.year;
    // La ligne n'existe pas encore ; render() l'initialisera.
    this.domElt = null;
  }

  get skulls() {
    return "☠️".repeat(this.dangerLevel);
  }

  // Crée et ajoute la ligne du monstre, puis synchronise ses champs.
  render() {
    const template = document.createElement("template");
    //crée un conteneur HTML temporaire
    template.innerHTML = getTemplate(this);
    //génère la ligne à partir des données de cette instance
    this.domElt = template.content.firstElementChild;
    //récupère l'élément racine

    this.updateDOM();
    return this.domElt;
  }

  // Recopie les propriétés de l'instance dans les champs et le texte affiché.   === Réalisé avec l'aide de l'agent J'y arrive pas ;)
  updateDOM() {
    // Met à jour le champ modifiable et le texte visible du nom.
    this.domElt.querySelector(".input-name").value = this.name;
    //cherche le champ du nom dans cette ligne et place le nom dans le champ modifiable
    this.domElt
      .querySelector(".input-name")
      .closest("td")
      .querySelector(".isEditing-hidden").textContent = this.name;
    //remonte à la cellule qui contient ce champ, cherche dans cette cellule l’élément prévu pour afficher le texte hors édition, actualise le texte visible.

    // Met à jour le champ de sélection et le texte visible du type.
    this.domElt.querySelector(".input-type").value = this.type;
    this.domElt
      .querySelector(".input-type")
      .closest("td")
      .querySelector(".isEditing-hidden").textContent = this.type;

    // Met à jour le champ numérique et le texte visible du niveau de danger.
    this.domElt.querySelector(".input-danger").value = this.dangerLevel;

    const dangerSpan = this.domElt
      .querySelector(".input-danger")
      .closest("td")
      .querySelector(".isEditing-hidden");
    dangerSpan.textContent = this.skulls; // <-- Utilise bien this.skulls ici et non this.dangerLevel
    dangerSpan.title = this.dangerLevel;

    // Met à jour le champ modifiable et le texte visible de l'année.
    this.domElt.querySelector(".input-year").value = this.year;
    this.domElt
      .querySelector(".input-year")
      .closest("td")
      .querySelector(".isEditing-hidden").textContent = this.year;
  }

  // Active le mode édition ; les règles CSS affichent alors les champs de saisie.
  edit() {
    this.domElt.classList.add("isEditing");
  }

  // Lit les champs, enregistre les données auprès de l'API et actualise l'affichage.
  async saveUpdate() {
    // Rassemble les valeurs actuelles des champs de cette ligne.
    const updatedData = {
      name: this.domElt.querySelector(".input-name").value,
      type: this.domElt.querySelector(".input-type").value,
      dangerLevel: Number(this.domElt.querySelector(".input-danger").value),
      year: Number(this.domElt.querySelector(".input-year").value),
    };

    // Attend la réponse de l'API avant de modifier les données locales.
    const saved = await DB.updateOne(this.id, updatedData);

    // Met à jour l'instance avec les données renvoyées par l'API.
    this.name = saved.name;
    this.type = saved.type;
    this.dangerLevel = saved.dangerLevel;
    this.year = saved.year;

    // Affiche les nouvelles valeurs dans la ligne.
    this.updateDOM();

    // Quitte le mode édition après l'enregistrement.
    this.domElt.classList.remove("isEditing");
  }
}
