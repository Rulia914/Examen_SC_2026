// Importe le composant qui charge et affiche la liste des monstres.
import MonsterList from './components/monsterList/MonsterList';

// Initialise la liste dans l'élément principal et configure l'API à utiliser.
new MonsterList({
  el: "#app",
  apiURL: "https://6a4f4934f45d5352b6112e4b.mockapi.io/",
});
