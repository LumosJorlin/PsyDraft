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
// DELUSIONAL DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['DELUSIONAL'] = {
    sections: [
        { title: 'A. Core Delusion', prefix: 'A', items: [
            'presence of one or more delusions with a duration of 1 month or longer (A)'
        ]},
        { title: 'B, C & D. Functional Integrity', prefix: 'BCD', items: [
            'Criterion A for schizophrenia has never been met (B)',
            'apart from the impact of the delusions, functioning is not markedly impaired (C)',
            'behavior is not obviously bizarre or odd (C)',
            'if manic or depressive episodes have occurred, these have been brief relative to the delusional periods (D)'
        ]},
        { title: 'E. Exclusionary', prefix: 'E', items: [
            'not attributable to the physiological effects of a substance or medical condition (E)',
            'not better explained by another mental disorder, such as body dysmorphic disorder (E)'
        ]},
        { title: 'Delusional Types', prefix: 'TYPE', items: [
            'Erotomanic type',
            'Grandiose type',
            'Jealous type',
            'Persecutory type',
            'Somatic type',
            'Mixed type',
            'Unspecified type'
        ]}
    ]
};

// ----------------------------------------------------------------------
// DELUSIONAL DISORDER TEXT GENERATION
// ----------------------------------------------------------------------
function generateDelusionalText(selectedData) {
    const sections = { A: [], BCD: [], E: [] };
    const types = [];

    selectedData.forEach(item => {
        const letterMatch = item.text.match(/\(([A-E])\)/);
        let reference = letterMatch ? `(${letterMatch[1]})` : '';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'TYPE') {
            types.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    let output = ["**Diagnostic Summary: Delusional Disorder**"];

    // Criterion A: The Delusion and its type
    if (sections.A.length > 0) {
        let typeStr = types.length > 0 ? ` of the ${formatClinicalList(types)}` : "";
        output.push(`The clinical picture is defined by the ${formatClinicalList(sections.A)}${typeStr}.`);
    }

    // Criteria B & C: Preservation of Function
    if (sections.BCD.length > 0) {
        output.push(`Crucial to this diagnosis is the observation that ${formatClinicalList(sections.BCD)}.`);
    }

    // Criterion E: Exclusions
    if (sections.E.length > 0) {
        output.push(`The diagnosis is confirmed as ${formatClinicalList(sections.E)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['DELUSIONAL'] = generateDelusionalText;