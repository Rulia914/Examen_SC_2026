(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[`Giant reptile`,`Alien`,`Mutant`,`Giant insect`,`Robot`,`Deep-sea creature`],t=class{static setApiURL(e){this.apiURL=e}static async findAll(){return(await fetch(this.apiURL+`monsters/`)).json()}static async create(e){return(await fetch(this.apiURL+`monsters/`,{method:`POST`,headers:{"content-Type":`application/JSON`},body:JSON.stringify(e)})).json()}static async deleteOneById(e){let t=await fetch(this.apiURL+`monsters/`+e,{method:`DELETE`});if(!t.ok)throw Error(`Monster deletion failed: ${t.status}`);return t}static async updateOne(e,t){return(await fetch(this.apiURL+`monsters/`+e,{method:`PUT`,headers:{"content-Type":`application/JSON`},body:JSON.stringify(t)})).json()}static monsterTypes=[`Giant reptile`,`Alien`,`Mutant`,`Giant insect`,`Robot`,`Deep-sea creature`]};function n(e,t){return`
 
    <tr class="monster-row">
    <td class="p-3 font-semibold">
      <span class="isEditing-hidden">${e.name}</span>
      <input type="text" class="input-name isEditing-visible field" value="${e.name}" />
    </td>
    <td class="p-3">
      <span class="isEditing-hidden">${e.type}</span>
      <select class="input-type isEditing-visible field">
      ${t.map(t=>`
        <option ${t===e.type?`selected`:``}>${t}</option>
      `).join(``)}
      </select>
    </td>
    <td class="p-3 whitespace-nowrap">
      <!-- Base : afficher le chiffre. Bonus : afficher autant de ☠️ que le niveau -->
      <span class="isEditing-hidden" title="${e.dangerLevel}">${e.skulls}</span>
      <input type="number" min="1" max="5" class="input-danger isEditing-visible field" value="${e.dangerLevel}" />
    </td>
    <td class="p-3">
      <span class="isEditing-hidden">${e.year}</span>
      <input type="number" min="1950" max="1969" class="input-year isEditing-visible field" value="${e.year}" />
    </td>
    <td class="p-3">
      <div class="flex justify-end gap-2">
        <button type="button" class="btn-check isEditing-visible btn btn-jade py-2 px-3" aria-label="Save">
          <i class="fa-solid fa-check"></i>
        </button>
        <button type="button" class="btn-edit isEditing-hidden btn btn-gold py-2 px-3" aria-label="Edit">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="btn-delete isEditing-hidden btn btn-lipstick py-2 px-3" aria-label="Delete">
          <i class="fa-solid fa-skull"></i>
        </button>
      </div>
    </td>
  </tr>`}var r=class{constructor(e){this.id=e.id,this.name=e.name,this.type=e.type,this.dangerLevel=e.dangerLevel,this.year=e.year,this.domElt=null}get skulls(){return`☠️`.repeat(this.dangerLevel)}render(){let t=document.createElement(`template`);return t.innerHTML=n(this,e),this.domElt=t.content.firstElementChild,this.updateDOM(),this.domElt}updateDOM(){this.domElt.querySelector(`.input-name`).value=this.name,this.domElt.querySelector(`.input-name`).closest(`td`).querySelector(`.isEditing-hidden`).textContent=this.name,this.domElt.querySelector(`.input-type`).value=this.type,this.domElt.querySelector(`.input-type`).closest(`td`).querySelector(`.isEditing-hidden`).textContent=this.type,this.domElt.querySelector(`.input-danger`).value=this.dangerLevel;let e=this.domElt.querySelector(`.input-danger`).closest(`td`).querySelector(`.isEditing-hidden`);e.textContent=this.skulls,e.title=this.dangerLevel,this.domElt.querySelector(`.input-year`).value=this.year,this.domElt.querySelector(`.input-year`).closest(`td`).querySelector(`.isEditing-hidden`).textContent=this.year}edit(){this.domElt.classList.add(`isEditing`)}async saveUpdate(){let e={name:this.domElt.querySelector(`.input-name`).value,type:this.domElt.querySelector(`.input-type`).value,dangerLevel:Number(this.domElt.querySelector(`.input-danger`).value),year:Number(this.domElt.querySelector(`.input-year`).value)},n=await t.updateOne(this.id,e);this.name=n.name,this.type=n.type,this.dangerLevel=n.dangerLevel,this.year=n.year,this.updateDOM(),this.domElt.classList.remove(`isEditing`)}};function i(e){return`
    <header class="text-center mb-10">
    <p class="text-[var(--silver)] tracking-widest text-sm">A creature feature archive</p>
    <h1 class="marquee text-6xl md:text-8xl my-3">Monster Archive</h1>
    <p class="text-[var(--silver)] italic">
      They rose from the deep between 1950 and 1969. Someone had to keep the records.
    </p>
    </header>
   <main class="flex flex-col md:flex-row gap-8">
    <!-- Aside gauche pour le formulaire -->
    <aside class="deco-frame md:w-1/3 p-6 bg-[var(--murk)]/60 self-start">
      <h2 class="display text-2xl mb-5 text-[var(--pearl)]">File a new creature</h2>
  <form class="new-monster">
      <label class="block mb-4 text-[var(--silver)]">
        Name
        <input name="monsterName" type="text" class="field" placeholder="The Crawling Mass" required />
      </label>

      <label class="block mb-4 text-[var(--silver)]">
        Type
        <select name="monsterType" class="field">
        ${e.map(e=>`<option value="${e}">${e}</option>`).join(``)}
        </select>
      </label>

      <label class="block mb-4 text-[var(--silver)]">
        Danger level (1 to 5)
        <input name="dangerLevel" type="number" min="1" max="5" step="1" class="field" placeholder="3" required />
      </label>

      <label class="block mb-6 text-[var(--silver)]">
        Release year
        <input name="monsterYear" type="number" min="1950" max="1969" step="1" class="field" placeholder="1957" required />
      </label>
      <button type="submit" class="btn btn-lipstick w-full py-3 px-4 text-lg">Add to the archive</button>
    </form>
    </aside>

    <!-- Section droite pour la liste des créatures -->
    <section class="deco-frame md:w-2/3 p-6 bg-[var(--murk)]/40">
      <div class="flex flex-wrap justify-between items-baseline gap-2 mb-5">
        <h2 class="display text-2xl">The archive</h2>
        <p class="text-[var(--silver)]">
          Creatures on file :
          <span class="display text-2xl text-[var(--gold)] monster-count">xxx</span>
        </p>
      </div>

      <!-- Filtre de recherche -->
      <input type="search" class="search field mb-5" placeholder="Search by name or type" />

      <!-- Liste des créatures triée et filtrée -->
      <div class="overflow-x-auto">
        <table class="monsters-table w-full">
          <thead>
            <tr>
              <th class="text-left p-3"><a href="#" name="name">Name</a></th>
              <th class="text-left p-3"><a href="#" name="type">Type</a></th>
              <th class="text-left p-3"><a href="#" name="dangerLevel">Danger Level</a></th>
              <th class="text-left p-3"><a href="#" name="year">Year</a></th>
              <th class="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody class="monsters-list">
          </tbody>
        </table>
      </div>
    </section>
  </main>
      `}new class{constructor(e){this.domElt=document.querySelector(e.el),this.listDomElt=null,t.setApiURL(e.apiURL),this.monsters=[],this.loadMonsters()}sortMonsters(e){this.lastSort||={column:null,smallToLarg:!0},this.lastSort.column===e?this.lastSort.smallToLarg=!this.lastSort.smallToLarg:(this.lastSort.column=e,this.lastSort.smallToLarg=!0);let t=this.lastSort.smallToLarg?1:-1;this.monsters=[...this.monsters].sort((n,r)=>typeof n[e]==`string`?n[e].localeCompare(r[e])*t:(n[e]-r[e])*t);let n=this.domElt.querySelector(`.monsters-table tbody`);n&&this.monsters.forEach(e=>{n.appendChild(e.domElt)})}async loadMonsters(){let e=await t.findAll();this.monsters=e.map(e=>new r(e)),this.render()}getMonstersCount(){return this.monsters.length}renderMonstersCount(){this.domElt.querySelector(`.monster-count`).innerText=this.getMonstersCount()}render(){this.domElt.innerHTML=i(e),this.listDomElt=this.domElt.querySelector(`.monsters-list`),this.monsters.forEach(e=>this.listDomElt.append(e.render())),this.renderMonstersCount(),this.initEvents()}async addMonster(e){let n=new r(await t.create(e));this.monsters.push(n),this.listDomElt.append(n.render()),this.renderMonstersCount()}async removeMonsterFromList(e){let n=this.monsters.find(t=>t.id===e);await t.deleteOneById(e),this.monsters.splice(this.monsters.indexOf(n),1),n.domElt.remove(),this.renderMonstersCount()}initEvents(){this.domElt.addEventListener(`click`,e=>{console.log(`Clic détecté sur :`,e.target);let t=e.target.closest(`a[name]`);if(t){e.preventDefault();let n=t.getAttribute(`name`);this.sortMonsters(n)}});let e=this.domElt.querySelector(`.search`);e&&e.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim(),n=this.monsters.filter(e=>{let n=e.name.toLowerCase(),r=e.type.toLowerCase();return n.includes(t)||r.includes(t)}),r=this.domElt.querySelector(`.monsters-table tbody`);r&&(r.innerHTML=``,n.forEach(e=>{r.appendChild(e.domElt)}))});let t=this.domElt.querySelector(`.new-monster`);t.addEventListener(`submit`,async e=>{e.preventDefault();let n=new FormData(t),i=new r({name:n.get(`monsterName`),type:n.get(`monsterType`),dangerLevel:Number(n.get(`dangerLevel`)),year:Number(n.get(`monsterYear`))});await this.addMonster(i),t.reset()}),this.listDomElt.addEventListener(`click`,async e=>{let t=e.target.closest(`button`);if(!t)return;let n=t.closest(`.monster-row`);if(!n)return;let r=this.monsters.find(e=>e.domElt===n);r&&(t.classList.contains(`btn-delete`)&&await this.removeMonsterFromList(r.id),t.classList.contains(`btn-edit`)&&(console.log(`Clic détecté sur le bouton check pour le monstre :`,r.id),await r.edit()),t.classList.contains(`btn-check`)&&await r.saveUpdate())})}}({el:`#app`,apiURL:`https://6a4f4934f45d5352b6112e4b.mockapi.io/`});