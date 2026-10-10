export default class DB {
    // Enregistre l'URL de base utilisée par toutes les requêtes.
    static setApiURL(data) {        //reçoit l'adresse de base de l'API
      this.apiURL = data;           //Mémorise cette adresse. Comme la méthode est static, on l'appelle avec DB.setApiUrl, pas sur une instance
    }
  
    // Récupère tous les monstres depuis l'API.
    static async findAll() {        
                                    //déclare une méthode asynchrone pour récupérer tous les monstres
      const response = await fetch(this.apiURL + "monsters/");
                                    // envoie une requête HTTP à l’adresse de la liste des monstres et attend la réponse avant de continuer
      return response.json();       //lit le contenu JSON et le retourne
    }
//----------------------------------
// AJOUT D'UN MONSTRE
//----------------------------------
    // Envoie un nouveau monstre à l'API et retourne sa réponse.
    static async create(monster){   //recoit les données du monstre à créer
      const response = await fetch(this.apiURL + "monsters/", {
                                    //envoie la requête à l'API avec des options
        method: "POST",             //indique qu'il s'agit d'une création
        headers: {"content-Type": "application/JSON"},
                                    //le corps de la requête est en JSON
        body: JSON.stringify(monster),//conversion du js en json pour l'envoi
      });
      return response.json();       //retour du monstre avec son id
    }
    //----------------------------------
    // SUPPRESSION D'UN MONSTRE
    //----------------------------------
    // Supprime de l'API le monstre correspondant à l'id fourni.
    static async deleteOneById(id){  //reçiot l'id à supprimer
      const response = await fetch(this.apiURL + "monsters/" + id, {
                                    //construit l'adresse ciblant le monstre
        method: "DELETE"             // demande à l'API de supp le monstre
      });
      if (!response.ok) {
        throw new Error(`Monster deletion failed: ${response.status}`);
      }
      return response;              //la réponse DELETE peut ne contenir aucun JSON
    }
    //----------------------------------
    // MODIFICATION D'UN MONSTRE
    //----------------------------------
    // Remplace les données du monstre identifié
    static async updateOne(id, monster){
                                      //adresse des news infos du monstre
      const response = await fetch(this.apiURL + "monsters/" + id, {
        method: "PUT",                //demande de remplacement
        headers: {"content-Type": "application/JSON"},
        body: JSON.stringify(monster),//envoi des données en json
      });
      return response.json();         //retourne le contenu de la réponse
    }
  }