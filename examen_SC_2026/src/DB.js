export default class DB {
    static setApiURL(data) {
      this.apiURL = data;
    }
  
    static async findAll() {
      //transaction vers l'API
      const response = await fetch(this.apiURL + "monsters");
      return response.json();
    }

    static async create(monster){
      const response = await fetch(this.apiURL + "monsters", {
        method: "POST",
        headers: {"content-Type": "application/JSON"},
        body: JSON.stringify(monster),
      });
      return response.json(); 
    }
  }