import getTemplate from "./template";

export default class Monster {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.type = data.type;
      this.dangerLevel = data.dangerLevel;
      this.year = data.year;
      this.domElt =null;
    }
    render(el) {
      const template = document.createElement("template");
      template.innerHTML = getTemplate(this);
      this.domElt = template.content.firstElementChild;
      el.append(this.domElt);
    }
  }