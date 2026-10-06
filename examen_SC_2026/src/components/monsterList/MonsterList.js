import DB from '../../DB';
import Monster from '../monster/Monster';
import getTemplate from './template';


export default class MonsterList {
    constructor(data) {
      this.domElt = document.querySelector(data.el);
      DB.setApiURL(data.apiURL);
      this.monsters = [];
      this.loadMonsters(); //pour charger les todos
    }
    async loadMonsters() {
      const monsters = await DB.findAll();
      this.monsters = monsters.map((monster) => new Monster(monster));
      this.render();
    }
    render() {
      this.domElt.innerHTML = getTemplate(); 
      this.monsters.forEach((monster) => monster.render(this.domElt.querySelector(".monster-row")));
    }
  }
  