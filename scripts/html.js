// Importar funciones de otros archivos
import { calculateStatistics } from "./statistics.js";

// Manejo de archivos JSON
// Manejar archivos desde index.html
export const fetchJson = (path) => {
    return fetch(path)
    .then(respuesta => respuesta.json())
    .then(resultados => {
        const members = resultados.results[0].members;
        const statistics = calculateStatistics(members);

        return {
            members: members,
            statistics: statistics
        }
    });
}

// "Diccionario" de partidos
const parties = {
    D: 'Democrat',
    R: 'Republican',
    ID: 'Independent'
}

// Calcular años en servicio
const yearsInOffice = (member) => {
    return member.seniority ?? (member.end_date.slice(0, 4) - member.begin_date.slice(0, 4));
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
        <td class="name">${member.url ? `<a href="${member.url}" target="_blank" class="name-link">${member.first_name} ${member.last_name}</a>` : `${member.first_name} ${member.last_name}`}</td>
        <td>${parties[member.party]}</td>
        <td>${member.state}</td>
        <td>${yearsInOffice(member)}</td>
        <td>${member.votes_with_party_pct ?? `N/A`}</td>
        </tr>`)
        .join('');
}

// Manejo de los datos en attendance.html
// Tabla numero de miembros por partido
export const makeCountRows = (counts) => {
    return Object.entries(parties).map(([key, name]) => `
        <tr>
            <td>${name}</td>
            <td>${counts[key]}</td>
        </tr>
    `).join('');
}

// Tabla de missed votes
export const makeMissedVoteRows = (votes) => {
    return Object.entries(parties).map(([key, name]) => `
        <tr>
            <td>${name}</td>
            <td>${votes[key]}</td>
        </tr>
    `).join(''); 
}

// Funcion para llenar las tablas most engaged members y least engaged members 
export const makeEngagedRows = (members) => {
    return members.map(member => `
        <tr> 
            <td>${member.first_name} ${member.last_name}</td>
            <td>${member.missed_votes}</td>
            <td>${Number(member.missed_votes_pct).toFixed(2)}</td>
        </tr>
        `).join('');
}

// Manejo de los datos en loyalty.html
export const makeVotesPartyRows = (counts, votesWithParty) => {
    return Object.entries(parties).map(([key, name]) => `
        <tr>
            <td>${name}</td>
            <td>${counts[key]}</td>
            <td>${isNaN(votesWithParty[key]) ? 'N/A' : votesWithParty[key].toFixed(2)}</td>
        </tr>
    `).join('');
}

export const makeLoyaltyRows = (members, votesPartyPct) => {
    return members.map(member => `
            <tr>
                <td>${member.first_name} ${member.last_name}</td>
                <td>${member.total_votes}</td>
                <td>${member[votesPartyPct].toFixed(2)}</td>
            </tr>
        `).join('');
}