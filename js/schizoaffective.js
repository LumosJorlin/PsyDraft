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
// SCHIZOAFFECTIVE DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['SCHIZOAFFECTIVE'] = {
    sections: [
        { title: 'A. Concurrent Symptoms', prefix: 'A', items: [
            'an uninterrupted period of illness during which there is a major mood episode (1)',
            'delusions, hallucinations, or disorganized speech meeting Criterion A of schizophrenia (2)'
        ]},
        { title: 'B. Psychosis Independent of Mood', prefix: 'B', items: [
            'delusions or hallucinations for 2 or more weeks in the absence of a major mood episode'
        ]},
        { title: 'C. Proportionality of Mood', prefix: 'C', items: [
            'symptoms that meet criteria for a major mood episode are present for the majority of the total duration of the illness'
        ]},
        { title: 'Specifiers', prefix: 'SPEC', items: [
            'Bipolar type (includes manic episodes)',
            'Depressive type (includes only major depressive episodes)',
            'with catatonia'
        ]}
    ]
};

// ----------------------------------------------------------------------
// SCHIZOAFFECTIVE TEXT GENERATION
// ----------------------------------------------------------------------
function generateSchizoaffectiveText(selectedData) {
    const sections = { A: [], B: [], C: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        const numMatch = item.text.match(/\((\d+)\)/);
        const num = numMatch ? numMatch[1] : null;

        let reference = '';
        if (item.section === 'A' && num) reference = `(A${num})`;
        else if (item.section === 'B') reference = '(B)';
        else if (item.section === 'C') reference = '(C)';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'SPEC') {
            specifiers.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    let output = ["**Diagnostic Summary: Schizoaffective Disorder**"];

    // Criterion A & B logic: The longitudinal overlap
    if (sections.A.length > 0) {
        output.push(`The diagnostic profile is characterized by ${formatClinicalList(sections.A)}.`);
    }

    if (sections.B.length > 0) {
        output.push(`Crucially, the independent nature of the psychosis is confirmed by the presence of ${formatClinicalList(sections.B)}.`);
    }

    // Criterion C logic: Majority duration
    if (sections.C.length > 0) {
        output.push(`The longitudinal course is further validated because ${formatClinicalList(sections.C)}.`);
    }

    // Specifiers
    if (specifiers.length > 0) {
        output.push(`The presentation is categorized as the ${formatClinicalList(specifiers)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['SCHIZOAFFECTIVE'] = generateSchizoaffectiveText;