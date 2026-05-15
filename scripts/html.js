// Manejo de archivos JSON
// Manejar archivos desde index.html
export const fetchJson = (path) => {
    return fetch(path)
    .then(respuesta => respuesta.json())
    .then(resultados => resultados.results[0].members);
}

// "Diccionario" de partidos
const parties = {
    D: 'Democrat',
    R: 'Republican',
    ID: 'Independent'
}

// Manejo de archivo JSON states y creación del select en index.html 
export const makeStatesMenu = (stateIncluded) => {
    return fetch('./src/states.json')
    .then(states => states.json())
    .then(states => {
        return `
         <option value="" class="state-option" selected>Select a State</option> 
         ${states.filter(state => stateIncluded.has(state.abbreviation)).map(state => `<option value="${state.abbreviation}" class="state-option">${state.name}</option>`).join('')}
        `;
    })
}

// Filtros de busqueda
export const filters = () => {
    const checkboxes = document.querySelectorAll('.party-filter');
    return [...checkboxes] 
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
} 


// Funcion para manejar los datos directamente 
export const makeMemberRows = (members, selectedParties, selectedState) => {
    return members
    .filter(member => selectedParties.includes(member.party))
    .filter(member => selectedState === "" || member.state === selectedState)
    .map(member => `<tr>
        <td><a href="${member.url}" target="_blank" class="senator-link">${member.first_name} ${member.last_name}</a></td>
        <td>${parties[member.party]}</td>
        <td>${member.state}</td>
        <td>${member.seniority}</td>
        <td>${member.votes_with_party_pct}</td>
        </tr>`)
        .join('');
}