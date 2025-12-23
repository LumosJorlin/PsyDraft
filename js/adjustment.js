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
// ADJUSTMENT DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['ADJUSTMENT'] = {
    sections: [
        { title: 'A. Stressor Response', prefix: 'A', items: [
            'development of emotional or behavioral symptoms in response to an identifiable stressor occurring within 3 months of onset (A)'
        ]},
        { title: 'B. Clinical Significance', prefix: 'B', items: [
            'marked distress that is out of proportion to the severity or intensity of the stressor (1)',
            'significant impairment in social, occupational, or other important areas of functioning (2)'
        ]},
        { title: 'C, D & E. Exclusionary', prefix: 'CDE', items: [
            'stress-related disturbance does not meet the criteria for another mental disorder (C)',
            'symptoms do not represent normal bereavement (D)',
            'once the stressor or its consequences have terminated, symptoms do not persist for more than an additional 6 months (E)'
        ]},
        { title: 'Subtypes', prefix: 'SUB', items: [
            'With depressed mood',
            'With anxiety',
            'With mixed anxiety and depressed mood',
            'With disturbance of conduct',
            'With mixed disturbance of emotions and conduct',
            'Unspecified'
        ]}
    ]
};

// ----------------------------------------------------------------------
// ADJUSTMENT DISORDER TEXT GENERATION
// ----------------------------------------------------------------------
function generateAdjustmentText(selectedData) {
    const sections = { A: [], B: [], CDE: [] };
    const subtypes = [];

    selectedData.forEach(item => {
        const numMatch = item.text.match(/\((\d+)\)/);
        const num = numMatch ? numMatch[1] : null;

        let reference = '';
        if (item.section === 'A') reference = '(A)';
        else if (item.section === 'B' && num) reference = `(B${num})`;
        else {
            const letterMatch = item.text.match(/\(([C-E])\)/);
            if (letterMatch) reference = `(${letterMatch[1]})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'SUB') {
            subtypes.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    let output = ["**Diagnostic Summary: Adjustment Disorder**"];

    // Criterion A: The stressor
    if (sections.A.length > 0) {
        output.push(`The clinical presentation is marked by the ${formatClinicalList(sections.A)}.`);
    }

    // Subtypes: Integration of the "With..." flavor
    if (subtypes.length > 0) {
        output.push(`The symptomatic profile is characterized by a presentation ${formatClinicalList(subtypes)}.`);
    }

    // Criterion B: Clinical Significance
    if (sections.B.length > 0) {
        output.push(`The clinical significance of this reaction is evidenced by ${formatClinicalList(sections.B)}.`);
    }

    // Criteria C, D, E: The rules
    if (sections.CDE.length > 0) {
        output.push(`Diagnostic validity is maintained as the ${formatClinicalList(sections.CDE)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['ADJUSTMENT'] = generateAdjustmentText;