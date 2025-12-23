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
// PANIC DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['PANIC_DISORDER'] = {
    sections: [
        { title: 'A. Panic Attack Symptoms', prefix: 'A', items: [
            'palpitations or accelerated heart rate (1)',
            'sweating (2)',
            'trembling or shaking (3)',
            'sensations of shortness of breath or smothering (4)',
            'feelings of choking (5)',
            'chest pain or discomfort (6)',
            'nausea or abdominal distress (7)',
            'feeling dizzy, unsteady, or light-headed (8)',
            'chills or heat sensations (9)',
            'paresthesias or tingling sensations (10)',
            'derealization or depersonalization (11)',
            'fear of losing control or going crazy (12)',
            'fear of dying (13)'
        ]},
        { title: 'B. Follow-up Period', prefix: 'B', items: [
            'persistent concern or worry about additional panic attacks or their consequences (1)',
            'significant maladaptive change in behavior related to the attacks (2)'
        ]},
        { title: 'C & D. Exclusionary', prefix: 'CD', items: [
            'disturbance is not attributable to the effects of a substance or medical condition (C)',
            'presentation is not better explained by another mental disorder (D)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// PANIC DISORDER TEXT GENERATION
// ----------------------------------------------------------------------
function generatePanicDisorderText(selectedData) {
    const sections = { A: [], B: [], CD: [] };

    selectedData.forEach(item => {
        const numberMatch = item.text.match(/\((\d+)\)/);
        const num = numberMatch ? numberMatch[1] : null;

        let reference = '';
        // Map prefix A/B + number to (A1), (B2), etc.
        if (['A', 'B'].includes(item.section) && num) {
            reference = `(${item.section}${num})`;
        } else if (item.text.includes('(C)')) reference = '(C)';
        else if (item.text.includes('(D)')) reference = '(D)';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Panic Disorder**"];

    // Criterion A
    if (sections.A.length > 0) {
        output.push(`The presentation involves recurrent unexpected panic attacks characterized by ${formatClinicalList(sections.A)}.`);
    }

    // Criterion B
    if (sections.B.length > 0) {
        output.push(`At least one of the attacks has been followed by one month or more of ${formatClinicalList(sections.B)}.`);
    }

    // Criteria C & D
    if (sections.CD.length > 0) {
        output.push(`Differential analysis confirms that the ${formatClinicalList(sections.CD)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['PANIC_DISORDER'] = generatePanicDisorderText;