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
// SCHIZOPHRENIA DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['SCHIZOPHRENIA'] = {
    sections: [
        { title: 'A. Active-Phase Symptoms', prefix: 'A', items: [
            'delusions (1)',
            'hallucinations (2)',
            'disorganized speech, such as frequent derailment or incoherence (3)',
            'grossly disorganized or catatonic behavior (4)',
            'negative symptoms, such as diminished emotional expression or avolition (5)'
        ]},
        { title: 'B, C & D. Impact and Duration', prefix: 'BCD', items: [
            'level of functioning in one or more major areas is markedly below the level achieved prior to onset (B)',
            'continuous signs of the disturbance persist for at least 6 months (C)',
            'schizoaffective disorder and depressive or bipolar disorder with psychotic features have been ruled out (D)'
        ]},
        { title: 'E & F. Exclusionary', prefix: 'EF', items: [
            'disturbance is not attributable to the physiological effects of a substance or medical condition (E)',
            'if there is a history of autism spectrum disorder, the diagnosis is made only if prominent delusions or hallucinations are present (F)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// SCHIZOPHRENIA TEXT GENERATION
// ----------------------------------------------------------------------
function generateSchizophreniaText(selectedData) {
    const sections = { A: [], BCD: [], EF: [] };

    selectedData.forEach(item => {
        const numberMatch = item.text.match(/\((\d+)\)/);
        const num = numberMatch ? numberMatch[1] : null;

        let reference = '';
        if (item.section === 'A' && num) {
            reference = `(A${num})`;
        } else {
            const letterMatch = item.text.match(/\(([B-F])\)/);
            if (letterMatch) reference = `(${letterMatch[1]})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Schizophrenia**"];

    // Criterion A logic: Narrative of Positive/Negative symptoms
    if (sections.A.length > 0) {
        output.push(`The clinical presentation is marked by active-phase symptoms, including ${formatClinicalList(sections.A)}.`);
    }

    // Impact and Duration (B & C)
    if (sections.BCD.length > 0) {
        output.push(`The course of the illness is further characterized by ${formatClinicalList(sections.BCD)}.`);
    }

    // Exclusionary markers (E & F)
    if (sections.EF.length > 0) {
        output.push(`Diagnostic certainty is supported by the exclusion of external factors, specifically that the ${formatClinicalList(sections.EF)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['SCHIZOPHRENIA'] = generateSchizophreniaText;