// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

/**
 * Robust list formatter: Standardized across all modules.
 * Handles Oxford commas and proper list casing.
 */
function formatClinicalList(items) {
    if (!items || items.length === 0) return "";
    const cleanItems = items.map((s, index) => {
        let text = s.trim();
        // Capitalize the first item of the entire list for sentence starts
        return index === 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    });
    if (cleanItems.length === 1) return cleanItems[0];
    if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`;
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}

// ----------------------------------------------------------------------
// GAD CRITERIA DATA
// ----------------------------------------------------------------------
window.CRITERIA_DATA['GAD'] = {
    sections: [
        { title: 'A & B. Core Anxiety & Control', prefix: 'AB', items: [
            'excessive anxiety and worry occurring more days than not for at least 6 months (A)',
            'difficulty controlling the persistent worry (B)'
        ]},
        { title: 'C. Associated Somatic/Cognitive Symptoms', prefix: 'C', items: [
            'restlessness or feeling keyed up or on edge (1)',
            'being easily fatigued (2)',
            'difficulty concentrating or mind going blank (3)',
            'irritability (4)',
            'muscle tension (5)',
            'sleep disturbance (6)'
        ]},
        { title: 'D, E & F. Impact & Exclusionary', prefix: 'DEF', items: [
            'symptoms cause clinically significant distress or functional impairment (D)',
            'disturbance is not attributable to a substance or medical condition (E)',
            'presentation is not better explained by another mental disorder (F)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// GAD TEXT GENERATION
// ----------------------------------------------------------------------
function generateGADText(selectedData) {
    const sections = { AB: [], C: [], DEF: [] };

    selectedData.forEach(item => {
        const numberMatch = item.text.match(/\((\d+)\)/);
        const num = numberMatch ? numberMatch[1] : null;

        let reference = '';
        // Map prefix C + number to (C1), (C2), etc.
        if (item.section === 'C' && num) {
            reference = `(C${num})`;
        } else if (item.text.includes('(A)')) reference = '(A)';
        else if (item.text.includes('(B)')) reference = '(B)';
        else if (item.text.includes('(D)')) reference = '(D)';
        else if (item.text.includes('(E)')) reference = '(E)';
        else if (item.text.includes('(F)')) reference = '(F)';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Generalized Anxiety Disorder**"];

    // Core Worry (A & B)
    if (sections.AB.length > 0) {
        output.push(`The clinical presentation is defined by ${formatClinicalList(sections.AB)}.`);
    }

    // Associated Symptoms (C)
    if (sections.C.length > 0) {
        output.push(`This state of apprehension is associated with various physiological and cognitive features, including ${formatClinicalList(sections.C)}.`);
    }

    // Impact & Differential (D, E, F)
    if (sections.DEF.length > 0) {
        output.push(`Diagnostic validity is further supported by the fact that ${formatClinicalList(sections.DEF)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['GAD'] = generateGADText;