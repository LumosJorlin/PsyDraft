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
// PERSISTENT DEPRESSIVE DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['PDD'] = {
    sections: [
        { title: 'A. Core Chronic Mood', prefix: 'A', items: [
            'depressed mood for most of the day, for more days than not, for at least 2 years (A)'
        ]},
        { title: 'B. Symptom Manifestations', prefix: 'B', items: [
            'poor appetite or overeating (1)',
            'insomnia or hypersomnia (2)',
            'low energy or fatigue (3)',
            'low self-esteem (4)',
            'poor concentration or difficulty making decisions (5)',
            'feelings of hopelessness (6)'
        ]},
        { title: 'C & D. Longitudinal Stability', prefix: 'CD', items: [
            'during the 2-year period, the individual has never been without symptoms for more than 2 months at a time (C)',
            'criteria for a major depressive disorder may be continuously present for 2 years (D)'
        ]},
        { title: 'E-H. Exclusions & Impact', prefix: 'EH', items: [
            'there has never been a manic or hypomanic episode (E)',
            'the disturbance is not better explained by a persistent schizoaffective disorder or other psychotic disorder (F)',
            'symptoms are not attributable to a substance or medical condition (G)',
            'symptoms cause clinically significant distress or functional impairment (H)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// PDD TEXT GENERATION
// ----------------------------------------------------------------------
function generatePDDText(selectedData) {
    const sections = { A: [], B: [], CD: [], EH: [] };

    selectedData.forEach(item => {
        const numMatch = item.text.match(/\((\d+)\)/);
        const num = numMatch ? numMatch[1] : null;

        let reference = '';
        if (item.section === 'A') reference = '(A)';
        else if (item.section === 'B' && num) reference = `(B${num})`;
        else {
            const letterMatch = item.text.match(/\(([C-H])\)/);
            if (letterMatch) reference = `(${letterMatch[1]})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Persistent Depressive Disorder (Dysthymia)**"];

    // Criterion A: The Chronicity
    if (sections.A.length > 0) {
        output.push(`The presentation is defined by a chronic ${formatClinicalList(sections.A)}.`);
    }

    // Criterion B: Physiological/Cognitive Symptoms
    if (sections.B.length > 0) {
        output.push(`While depressed, the individual exhibits ${formatClinicalList(sections.B)}.`);
    }

    // Criteria C & D: Stability of the condition
    if (sections.CD.length > 0) {
        output.push(`The longitudinal course is established by the fact that ${formatClinicalList(sections.CD)}.`);
    }

    // Criteria E-H: Clinical Rigor
    if (sections.EH.length > 0) {
        output.push(`Clinical validity is confirmed as ${formatClinicalList(sections.EH)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['PDD'] = generatePDDText;