export default function getTemplate(monster) {
  return `
 
    <tr class="monster-row">
    <td class="p-3 font-semibold">
      <span class="isEditing-hidden">${monster.name}</span>
      <input type="text" class="input-name isEditing-visible field" value="${monster.name}" />
    </td>
    <td class="p-3">
      <span class="isEditing-hidden">Deep-sea creature</span>
      <select class="input-type isEditing-visible field">
        <option>Giant reptile</option>
        <option>Alien</option>
        <option>Mutant</option>
        <option>Giant insect</option>
        <option>Robot</option>
        <option selected>Deep-sea creature</option>
      </select>
    </td>
    <td class="p-3 whitespace-nowrap">
      <!-- Base : afficher le chiffre. Bonus : afficher autant de ☠️ que le niveau -->
      <span class="isEditing-hidden" title="${monster.dangerLevel}">${monster.skulls}</span>
      <input type="number" min="1" max="5" class="input-danger isEditing-visible field" value="${monster.dangerLevel}" />
    </td>
    <td class="p-3">
      <span class="isEditing-hidden">${monster.year}</span>
      <input type="number" min="1950" max="1969" class="input-year isEditing-visible field" value="${monster.year}" />
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
  </tr>`;
}
