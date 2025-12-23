// ======================================================================
// GLOBAL SAFETY & HELPERS
// ======================================================================
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

/**
 * Enhanced list formatter: Handles Oxford commas, capitalization, 
 * and ensures proper spacing between criteria references.
 */
function formatClinicalList(items) {
    if (!items || items.length === 0) return "";
    
    // Capitalize first letter of each item for a professional look
    const cleanItems = items.map(s => s.charAt(0).toUpperCase() + s.slice(1));

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
                'anxious distress',
                'melancholic features'
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
        const criterionNumber = numberMatch ? numberMatch[1] : null;

        let reference = '';
        if (item.section === 'A' && criterionNumber) reference = `(A${criterionNumber})`;
        else if (item.text.includes('(B)')) reference = '(B)';
        else if (item.text.includes('(C)')) reference = '(C)';
        else if (item.text.includes('(D)')) reference = '(D)';
        else if (item.text.includes('(E)')) reference = '(E)';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'DE' && !item.text.includes('(D)') && !item.text.includes('(E)')) {
            specifiers.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    const output = [];

    // --- Header ---
    output.push('**Diagnostic Summary: Major Depressive Disorder**');

    // --- Section A ---
    if (sections.A.length > 0) {
        const count = sections.A.length;
        const list = formatClinicalList(sections.A);
        output.push(`The clinical picture is characterized by ${count} depressive symptoms, notably ${list}.`);
    }

    // --- Sections B & C ---
    if (sections.BC.length > 0) {
        const bcList = formatClinicalList(sections.BC);
        output.push(`These symptoms result in ${bcList}.`);
    }

    // --- Sections D & E ---
    if (sections.DE.length > 0) {
        const deList = formatClinicalList(sections.DE);
        output.push(`Differential considerations confirm that the ${deList}.`);
    }

    // --- Specifiers ---
    if (specifiers.length > 0) {
        const specList = formatClinicalList(specifiers);
        output.push(`The current episode is further specified by ${specList}.`);
    }

    return output.join(' ');
}

window.FORMULATION_GENERATORS['MDD'] = generateMDDText;
