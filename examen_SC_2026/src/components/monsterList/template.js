export default function getTemplate() {
  return `
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
          <option>Giant reptile</option>
          <option>Alien</option>
          <option>Mutant</option>
          <option>Giant insect</option>
          <option>Robot</option>
          <option>Deep-sea creature</option>
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
      <input type="search" class="field mb-5" placeholder="Search by name or type" />

      <!-- Liste des créatures triée et filtrée -->
      <div class="overflow-x-auto">
        <table class="monsters-table w-full">
          <thead>
            <tr>
              <th class="text-left p-3"><a href="#">Name</a></th>
              <th class="text-left p-3"><a href="#">Type</a></th>
              <th class="text-left p-3"><a href="#">Danger</a></th>
              <th class="text-left p-3"><a href="#">Year</a></th>
              <th class="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody class="monsters-list">
          </tbody>
        </table>
      </div>
    </section>
  </main>
      `;
}
