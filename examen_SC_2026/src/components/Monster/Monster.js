import getTemplate from "./template";

export default class Monster {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.type = data.type;
      this.dangerLevel = data.dangerLevel;
      this.year = data.year;
    }
    render(el) {
      const template = document.createElement("div");
      template.innerHTML = getTemplate(this);
      el.append(template);
    }
  }