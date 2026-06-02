// Calculo de estadísticas
// Numero de miembros por partido
const countsByParty = (data) => {
    return data.reduce((party, members) => {
        party[members.party] += 1;
        return party;
    }, {D: 0, R: 0, ID: 0});
};

// Funciones para obtener el promedio de missed votes
const sumByParty = (members) => {
    return members.reduce((sum, member) => {
        const missedPct = member.missed_votes_pct ?? (member.missed_votes / member.total_votes * 100);
        sum[member.party].sum += missedPct;
        sum[member.party].count += 1;
        return sum;
    }, {
        D: { sum: 0, count: 0 },
        R: { sum: 0, count: 0 },
        ID: { sum: 0, count: 0 },
    });
};

const avgMissedVotes = (members) => {
    const sums = sumByParty(members);
    return {
        D: sums.D.count === 0 ? 0 : Number((sums.D.sum / sums.D.count).toFixed(2)),
        R: sums.R.count === 0 ? 0 : Number((sums.R.sum / sums.R.count).toFixed(2)),
        ID: sums.ID.count === 0 ? 0 : Number((sums.ID.sum / sums.ID.count).toFixed(2))
    }
}

// Funciones para las tablas least and most engaged members
const leastEngaged = (members) => {
    const sorted = members.map(member => ({
        ...member,
        missed_votes_pct: member.missed_votes_pct ?? (member.missed_votes / member.total_votes * 100) 
    }))
    .filter(member => member.missed_votes_pct !== null)
    .sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
    const initial = sorted.slice(0, Math.ceil(sorted.length * 0.1));
    const threshold = initial[initial.length - 1].missed_votes_pct;
    return sorted.filter(member => member.missed_votes_pct >= threshold);
}

const mostEngaged = (members) => {
    const sorted = members.map(member => ({
        ...member,
        missed_votes_pct: member.missed_votes_pct ?? (member.missed_votes / member.total_votes * 100) 
    }))
    .filter(member => member.missed_votes_pct !== null)
    .sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)
    const initial = sorted.slice(0, Math.ceil(sorted.length * 0.1));
    const threshold = initial[initial.length - 1].missed_votes_pct;
    return sorted.filter(member => member.missed_votes_pct <= threshold);
}

// Estadisticas para loyalty.html
// Funciones para obtener el promedio de votes with party
const sumByPartyLoyalty = (members) => {
    return members
    .filter(member => member.votes_with_party_pct !== null)
    .reduce((sum, member) => {
        sum[member.party].votes += member.votes_with_party_pct;
        sum[member.party].count += 1;
        return sum;
    }, {
        D: { votes: 0, count: 0 },
        R: { votes: 0, count: 0 },
        ID: { votes: 0, count: 0 },
    })
}

const votesWithParty = (members) => {
    const partyVotes = sumByPartyLoyalty(members);
    return {
        D: partyVotes.D.count === 0 ? NaN : Number((partyVotes.D.votes / partyVotes.D.count).toFixed(2)), 
        R: partyVotes.R.count === 0 ? NaN : Number((partyVotes.R.votes / partyVotes.R.count).toFixed(2)), 
        ID: partyVotes.ID.count === 0 ? NaN : Number((partyVotes.ID.votes / partyVotes.ID.count).toFixed(2)), 
    } 
}

// Funciones para least and most loyal
const leastLoyal = (members) => {
    const sorted = members.map(member => ({
        ...member,
        votes_against_party_pct: member.votes_against_party_pct ?? (100 - member.votes_with_party_pct)
    })) 
    .filter(member => member.votes_against_party_pct !== null)
    .sort((a, b) => b.votes_against_party_pct - a.votes_against_party_pct)
    const initial = sorted.slice(0, Math.ceil(sorted.length * 0.1));
    const threshold = initial[initial.length - 1].votes_against_party_pct;
    return sorted.filter(member => member.votes_against_party_pct >= threshold)
}

const mostLoyal = (members) => {
    const sorted =  members.filter(member => member.votes_with_party_pct !== null)
    .sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)
    const initial = sorted.slice(0, Math.ceil(sorted.length * 0.1));
    const threshold = initial[initial.length - 1].votes_with_party_pct;
    return sorted.filter(member => member.votes_with_party_pct >= threshold);
}

// Objeto de estadisticas
export const calculateStatistics = (members) => {
    return {
        counts: countsByParty(members),
        missed: avgMissedVotes(members),
        votesWithParty: votesWithParty(members),
        leastEngaged: leastEngaged(members),
        mostEngaged: mostEngaged(members),
        leastLoyal: leastLoyal(members),
        mostLoyal: mostLoyal(members)
    }
}
