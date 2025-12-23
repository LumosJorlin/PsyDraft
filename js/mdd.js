// ======================================================================
// GLOBAL SAFETY & HELPERS
// ======================================================================
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

/**
 * Robust list formatter: Handles Oxford commas, capitalization, 
 * and ensures proper spacing between criteria references.
 */
function formatClinicalList(items) {
    if (!items || items.length === 0) return "";
    
    // Ensure the first item is capitalized for the start of a list
    const cleanItems = items.map((s, index) => {
        let text = s.trim();
        return index === 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    });

    if (cleanItems.length === 1) return cleanItems[0];
    if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`;
    
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}

// ======================================================================
// MDD CRITERIA DATA
// ======================================================================
window.CRITERIA_DATA['MDD'] = {
    sections: [
        {
            title: 'Criterion A: Symptom Profile',
            prefix: 'A',
            items: [
                'depressed mood most of the day (1)',
                'markedly diminished interest or pleasure in activities (2)',
                'significant weight change or appetite disturbance (3)',
                'insomnia or hypersomnia (4)',
                'observable psychomotor agitation or retardation (5)',
                'fatigue or loss of energy (6)',
                'feelings of worthlessness or excessive guilt (7)',
                'diminished ability to think or concentrate (8)',
                'recurrent thoughts of death or suicidal ideation (9)'
            ]
        },
        {
            title: 'B & C: Functional Impact & Etiology',
            prefix: 'BC',
            items: [
                'clinically significant distress or impairment in functioning (B)',
                'symptoms not attributable to a substance or medical condition (C)'
            ]
        },
        {
            title: 'D, E & Clinical Specifiers',
            prefix: 'DE',
            items: [
                'presentation not better explained by a psychotic disorder (D)',
                'no history of manic or hypomanic episodes (E)',
                'mild severity',
                'moderate severity',
                'severe severity',
                'with anxious distress',
                'with melancholic features'
            ]
        }
    ]
};

// ======================================================================
// MDD TEXT GENERATION
// ======================================================================
function generateMDDText(selectedData) {
    const sections = { A: [], BC: [], DE: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        const numberMatch = item.text.match(/\((\d+)\)/);
        const num = numberMatch ? numberMatch[1] : null;

        let reference = '';
        // Map prefix A + number to (A1)
        if (item.section === 'A' && num) {
            reference = `(A${num})`;
        } else if (item.text.includes('(B)')) reference = '(B)';
        else if (item.text.includes('(C)')) reference = '(C)';
        else if (item.text.includes('(D)')) reference = '(D)';
        else if (item.text.includes('(E)')) reference = '(E)';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        // Route to criteria vs specifiers
        if (item.section === 'DE' && !reference) {
            specifiers.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    const output = ["**Diagnostic Summary: Major Depressive Disorder**"];

    if (sections.A.length > 0) {
        output.push(`The clinical presentation is characterized by ${sections.A.length} depressive symptoms, notably ${formatClinicalList(sections.A)}.`);
    }

    if (sections.BC.length > 0) {
        output.push(`The reported symptoms result in ${formatClinicalList(sections.BC)}.`);
    }

    if (sections.DE.length > 0) {
        output.push(`Differential considerations indicate that the ${formatClinicalList(sections.DE)}.`);
    }

    if (specifiers.length > 0) {
        output.push(`The episode is further characterized by ${formatClinicalList(specifiers)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['MDD'] = generateMDDText;