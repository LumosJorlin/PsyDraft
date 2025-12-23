// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

/**
 * Standardized list formatter for clinical coherence.
 */
function formatClinicalList(items) {
    if (!items || items.length === 0) return "";
    const cleanItems = items.map((s, index) => {
        let text = s.trim();
        return index === 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    });
    if (cleanItems.length === 1) return cleanItems[0];
    if (cleanItems.length === 2) return `${cleanItems[0]}${items[1].includes('(') ? ' ' : ' and '}${cleanItems[1]}`;
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}

// ----------------------------------------------------------------------
// NEUROCOGNITIVE DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['NCD'] = {
    sections: [
        { title: 'A. Evidence of Cognitive Decline', prefix: 'A', items: [
            'significant decline from a previous level of performance in one or more cognitive domains (A1)',
            'decline is documented by standardized neuropsychological testing or quantified clinical assessment (A2)'
        ]},
        { title: 'B. Impact on Independence', prefix: 'B', items: [
            'cognitive deficits interfere with independence in everyday activities (Major NCD)',
            'cognitive deficits do NOT interfere with capacity for independence in everyday activities (Mild NCD)'
        ]},
        { title: 'C & D. Exclusions', prefix: 'CD', items: [
            'cognitive deficits do not occur exclusively in the context of a delirium (C)',
            'cognitive deficits are not better explained by another mental disorder, such as MDD or Schizophrenia (D)'
        ]},
        { title: 'Etiology Specifiers', prefix: 'ETIO', items: [
            'Due to Alzheimer’s disease',
            'Frontotemporal NCD',
            'With Lewy bodies',
            'Vascular NCD',
            'Due to traumatic brain injury',
            'Due to Parkinson’s disease',
            'Due to HIV infection',
            'Due to Huntington’s disease'
        ]}
    ]
};

// ----------------------------------------------------------------------
// TEXT GENERATION
// ----------------------------------------------------------------------
function generateNCDText(selectedData) {
    const sections = { A: [], B: [], CD: [] };
    const etiologies = [];

    selectedData.forEach(item => {
        const refMatch = item.text.match(/\(([^)]+)\)/);
        let reference = refMatch ? `(${refMatch[1]})` : '';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'ETIO') {
            etiologies.push(cleanText);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    // Determine Severity Title
    let severity = "Neurocognitive Disorder";
    if (sections.B.some(t => t.includes("major"))) severity = "Major Neurocognitive Disorder";
    if (sections.B.some(t => t.includes("mild"))) severity = "Mild Neurocognitive Disorder";

    let output = [`**Diagnostic Summary: ${severity}**`];

    // Criterion A: The Decline
    if (sections.A.length > 0) {
        output.push(`The diagnosis is established by evidence of a ${formatClinicalList(sections.A)}.`);
    }

    // Criterion B: Independence
    if (sections.B.length > 0) {
        output.push(`Regarding functional status, it is noted that the ${formatClinicalList(sections.B)}.`);
    }

    // Etiology
    if (etiologies.length > 0) {
        output.push(`The clinical presentation is suspected to be ${formatClinicalList(etiologies)}.`);
    }

    // Criteria C & D: Rigor
    if (sections.CD.length > 0) {
        output.push(`Diagnostic validity is maintained as the ${formatClinicalList(sections.CD)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['NCD'] = generateNCDText;