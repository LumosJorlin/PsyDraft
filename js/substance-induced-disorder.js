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
    if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`;
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}

// ----------------------------------------------------------------------
// SUBSTANCE/MEDICATION-INDUCED DISORDER DATA
// ----------------------------------------------------------------------
window.CRITERIA_DATA['SUBSTANCE_INDUCED'] = {
    sections: [
        { title: 'A. Primary Symptom Presentation', prefix: 'A', items: [
            'prominent and persistent disturbance in mood (depressed or elevated) (A)',
            'prominent hallucinations or delusions (A)',
            'prominent anxiety or panic attacks (A)'
        ]},
        { title: 'B. Evidence of Etiology', prefix: 'B', items: [
            'symptoms developed during or soon after substance intoxication or withdrawal (1)',
            'involved substance/medication is capable of producing the symptoms (2)'
        ]},
        { title: 'C & D. Exclusionary Requirements', prefix: 'CD', items: [
            'disturbance is not better explained by an independent mental disorder (C)',
            'disturbance does not occur exclusively during the course of a delirium (D)',
            'symptoms persisted for a substantial period (e.g., 1 month) after cessation of withdrawal or intoxication (C-Exclusion)'
        ]},
        { title: 'Clinical Context', prefix: 'SPEC', items: [
            'With onset during intoxication',
            'With onset during withdrawal'
        ]}
    ]
};

// ----------------------------------------------------------------------
// TEXT GENERATION
// ----------------------------------------------------------------------
function generateSubstanceInducedText(selectedData) {
    const sections = { A: [], B: [], CD: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        const numMatch = item.text.match(/\((\d+)\)/);
        const num = numMatch ? numMatch[1] : null;

        let reference = '';
        if (item.section === 'A') reference = '(A)';
        else if (item.section === 'B' && num) reference = `(B${num})`;
        else {
            const letterMatch = item.text.match(/\(([C-D])\)/);
            if (letterMatch) reference = `(${letterMatch[1]})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'SPEC') {
            specifiers.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    let output = ["**Diagnostic Summary: Substance/Medication-Induced Disorder**"];

    if (sections.A.length > 0) {
        output.push(`The clinical presentation is dominated by ${formatClinicalList(sections.A)}.`);
    }

    if (sections.B.length > 0) {
        output.push(`There is clear evidence from the history, physical examination, or laboratory findings that ${formatClinicalList(sections.B)}.`);
    }

    if (specifiers.length > 0) {
        output.push(`The condition is further characterized ${formatClinicalList(specifiers)}.`);
    }

    if (sections.CD.length > 0) {
        output.push(`Clinical rigor is maintained as the ${formatClinicalList(sections.CD)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['SUBSTANCE_INDUCED'] = generateSubstanceInducedText;