function isNamed(name, firstName) {
    return new RegExp(`^${firstName}(?:\\s|$)`, 'i').test(String(name || '').trim());
}

function applyGroomTieBonus(rows) {
    const thomasScores = new Set(
        rows.filter(row => isNamed(row.navn, 'Thomas')).map(row => Number(row.score))
    );

    return rows
        .map(row => {
            const grunnscore = Number(row.score);
            if (!isNamed(row.navn, 'Terje') || !thomasScores.has(grunnscore)) return row;
            return { ...row, grunnscore, score: grunnscore + 1, bonus: 1 };
        })
        .sort((a, b) => Number(b.score) - Number(a.score)
            || String(a.sist || '').localeCompare(String(b.sist || '')));
}

module.exports = { applyGroomTieBonus };
