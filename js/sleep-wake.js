// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

function formatClinicalList(items) {
    if (!items || items.length === 0) return "";
    const cleanItems = items.map((s, index) => {
        let text = s.trim();
        return index === 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    });
    if (cleanItems.length === 1) return cleanItems[0];
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}

// ----------------------------------------------------------------------
// SLEEP-WAKE DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['SLEEP_WAKE'] = {
    sections: [
        { title: '1. Insomnia Symptoms (Criterion A)', prefix: 'INS', items: [
            'difficulty initiating sleep (1)',
            'difficulty maintaining sleep, characterized by frequent awakenings (2)',
            'early-morning awakening with inability to return to sleep (3)'
        ]},
        { title: '2. Narcolepsy Symptoms (Criterion A)', prefix: 'NARC', items: [
            'recurrent periods of an irrepressible need to sleep, lapsing into sleep, or napping (1)',
            'episodes of cataplexy (sudden bilateral loss of muscle tone) (2)',
            'hypocretin deficiency (as measured in CSF) (3)',
            'REM sleep latency ≤ 15 minutes on nocturnal polysomnography (4)'
        ]},
        { title: '3. Duration & Frequency', prefix: 'DUR', items: [
            'occurs at least 3 nights per week (B)',
            'present for at least 3 months (C)',
            'occurs despite adequate opportunity for sleep (D)'
        ]},
        { title: '4. Impact & Exclusions', prefix: 'EXCL', items: [
            'causes clinically significant distress or impairment in functioning (E)',
            'not attributable to the physiological effects of a substance (F)',
            'coexisting mental disorders and medical conditions do not adequately explain the complaint (G)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// SLEEP-WAKE GENERATOR
// ----------------------------------------------------------------------
function generateSleepWakeText(selectedData) {
    const sections = { INS: [], NARC: [], DUR: [], EXCL: [] };
    selectedData.forEach(item => sections[item.section]?.push(item.text.replace(/\s*\([^)]+\)\s*/g, '').trim()));

    let diagnosis = "Sleep-Wake Disorder";
    if (sections.INS.length > 0) diagnosis = "Insomnia Disorder";
    if (sections.NARC.length > 0) diagnosis = "Narcolepsy";

    let output = [`**Diagnostic Summary: ${diagnosis}**`];

    // Primary Symptoms
    if (sections.INS.length > 0) {
        output.push(`The individual reports significant dissatisfaction with sleep quantity or quality, specifically ${formatClinicalList(sections.INS)}.`);
    }
    if (sections.NARC.length > 0) {
        output.push(`The presentation is marked by ${formatClinicalList(sections.NARC)}.`);
    }

    // Temporal Criteria
    if (sections.DUR.length > 0) {
        output.push(`The sleep disturbance is chronic, noted to ${formatClinicalList(sections.DUR)}.`);
    }

    // Clinical Context
    if (sections.EXCL.length > 0) {
        output.push(`The clinical formulation is confirmed as the ${formatClinicalList(sections.EXCL)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['SLEEP_WAKE'] = generateSleepWakeText;