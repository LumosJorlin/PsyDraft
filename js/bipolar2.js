// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

/**
 * Standardized list formatter: Handles Oxford commas and proper narrative casing.
 */
function formatClinicalList(items) {
    if (!items || items.length === 0) return "";
    const cleanItems = items.map((s, index) => {
        let text = s.trim();
        return index === 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    });
    if (cleanItems.length === 1) return cleanItems[0];
    if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`;
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}

// ----------------------------------------------------------------------
// BIPOLAR II DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['BIPOLAR_II'] = {
    sections: [
        { title: 'Hypomanic Symptoms (Criterion B)', prefix: 'B', items: [
            'inflated self-esteem or grandiosity (1)',
            'decreased need for sleep (2)',
            'more talkative than usual or pressure to keep talking (3)',
            'flight of ideas or racing thoughts (4)',
            'distractibility (5)',
            'increase in goal-directed activity or psychomotor agitation (6)',
            'excessive involvement in activities with high potential for painful consequences (7)'
        ]},
        { title: 'Mood & Duration (Criterion A)', prefix: 'A', items: [
            'abnormally and persistently elevated, expansive, or irritable mood and increased activity/energy lasting at least 4 consecutive days (A)'
        ]},
        { title: 'Clinical Context (C, D, E)', prefix: 'CDE', items: [
            'episode is associated with an unequivocal change in functioning that is uncharacteristic of the individual (C)',
            'disturbance in mood and the change in functioning are observable by others (D)',
            'the episode is NOT severe enough to cause marked impairment in functioning or to necessitate hospitalization (E)'
        ]},
        { title: 'Major Depressive Episode', prefix: 'MDE', items: [
            'history of at least one Major Depressive Episode (MDE)'
        ]},
        { title: 'Exclusionary (F)', prefix: 'X', items: [
            'there has never been a manic episode (F)',
            'symptoms are not better explained by a psychotic disorder'
        ]}
    ]
};

// ----------------------------------------------------------------------
// BIPOLAR II TEXT GENERATION
// ----------------------------------------------------------------------
function generateBipolarIIText(selectedData) {
    const sections = { A: [], B: [], CDE: [], MDE: [], X: [] };

    selectedData.forEach(item => {
        const numMatch = item.text.match(/\((\d+)\)/);
        const num = numMatch ? numMatch[1] : null;

        let reference = '';
        if (item.section === 'A') reference = '(A)';
        else if (item.section === 'B' && num) reference = `(B${num})`;
        else {
            const letterMatch = item.text.match(/\(([C-F])\)/);
            if (letterMatch) reference = `(${letterMatch[1]})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Bipolar II Disorder**"];

    // 1. Requirement of Depressive Episode
    if (sections.MDE.length > 0) {
        output.push(`The clinical history is marked by the ${formatClinicalList(sections.MDE)}.`);
    }

    // 2. Hypomanic Mood & Duration
    if (sections.A.length > 0) {
        output.push(`Diagnostic criteria for a hypomanic episode are met, defined by ${formatClinicalList(sections.A)}.`);
    }

    // 3. Hypomanic Symptoms
    if (sections.B.length > 0) {
        output.push(`During this period, the individual has consistently exhibited ${formatClinicalList(sections.B)}.`);
    }

    // 4. Functional Markers (Crucial for Bipolar II vs I)
    if (sections.CDE.length > 0) {
        output.push(`The hypomanic presentation is further validated by several clinical markers: ${formatClinicalList(sections.CDE)}.`);
    }

    // 5. Mandatory Exclusion
    if (sections.X.length > 0) {
        output.push(`Differential diagnosis is confirmed by the fact that ${formatClinicalList(sections.X)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['BIPOLAR_II'] = generateBipolarIIText;