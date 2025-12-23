// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

/**
 * Standardized list formatter: Handles Oxford commas and capitalization.
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
// BORDERLINE PERSONALITY DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['BPD'] = {
    sections: [
        { title: 'Criterion A: Pervasive Pattern', prefix: 'C', items: [
            'frantic efforts to avoid real or imagined abandonment (1)',
            'a pattern of unstable and intense interpersonal relationships (2)',
            'identity disturbance and markedly unstable self-image (3)',
            'impulsivity in at least two areas that are potentially self-damaging (4)',
            'recurrent suicidal behavior, gestures, threats, or self-mutilating behavior (5)',
            'affective instability due to a marked reactivity of mood (6)',
            'chronic feelings of emptiness (7)',
            'inappropriate, intense anger or difficulty controlling anger (8)',
            'transient, stress-related paranoid ideation or severe dissociative symptoms (9)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// BPD TEXT GENERATION
// ----------------------------------------------------------------------
function generateBPDText(selectedData) {
    const sections = { C: [] };

    selectedData.forEach(item => {
        const numberMatch = item.text.match(/\((\d+)\)/);
        const num = numberMatch ? numberMatch[1] : null;

        // Map 1-9 to (C1)-(C9) for precise internal referencing
        let reference = num ? `(C${num})` : '';
        
        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Borderline Personality Disorder**"];

    if (sections.C.length > 0) {
        const count = sections.C.length;
        
        output.push(`The clinical evaluation identifies a pervasive pattern of instability in interpersonal relationships, self-image, and affects, alongside marked impulsivity.`);
        
        output.push(`Beginning by early adulthood and present in a variety of contexts, this presentation is evidenced by ${count} specific diagnostic markers: ${formatClinicalList(sections.C)}.`);
        
        // Narrative summary of the core "instability"
        if (count >= 5) {
            output.push(`These symptoms collectively represent the diagnostic threshold for Borderline Personality Disorder as defined by the DSM-5-TR.`);
        } else {
            output.push(`While significant, the current presentation does not meet the full numeric threshold for a formal diagnosis at this time.`);
        }
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['BPD'] = generateBPDText;