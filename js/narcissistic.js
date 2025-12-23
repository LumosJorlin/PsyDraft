// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

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

window.CRITERIA_DATA['NARCISSISTIC'] = {
    sections: [
        { title: 'A. Specific Behavioral Symptoms', prefix: 'A', items: [
            'grandiose sense of self-importance (1)',
            'preoccupation with fantasies of unlimited success, power, or brilliance (2)',
            'belief that they are "special" and can only be understood by high-status people (3)',
            'requirement for excessive admiration (4)',
            'sense of entitlement (5)',
            'interpersonally exploitative behavior (6)',
            'lacks empathy (7)',
            'envy of others or belief that others are envious of them (8)',
            'arrogant, haughty behaviors or attitudes (9)'
        ]},
        { title: 'B-F. General PD Criteria', prefix: 'GEN', items: [
            'pattern is inflexible and pervasive across a broad range of situations (B)',
            'leads to clinically significant distress or impairment (C)',
            'pattern is stable and of long duration with onset in adolescence or early adulthood (D)',
            'not better explained as a manifestation of another mental disorder (E)',
            'not attributable to the physiological effects of a substance or medical condition (F)'
        ]}
    ]
};

function generateNarcissisticText(selectedData) {
    const sections = { A: [], GEN: [] };

    selectedData.forEach(item => {
        const num = (item.text.match(/\((\d+)\)/) || [])[1];
        const letter = (item.text.match(/\(([B-F])\)/) || [])[1];
        
        let reference = '';
        if (item.section === 'A' && num) reference = `(A${num})`;
        else if (letter) reference = `(${letter})`;

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        sections[item.section]?.push(reference ? `${cleanText} ${reference}` : cleanText);
    });

    let output = ["**Diagnostic Summary: Narcissistic Personality Disorder**"];

    if (sections.A.length > 0) {
        const count = sections.A.length;
        output.push(`The individual demonstrates a pervasive pattern of grandiosity and a need for admiration, manifested by ${count} specific criteria: ${formatClinicalList(sections.A)}.`);
        
        if (count < 5) {
            output.push("Note: The current symptom count is below the diagnostic threshold of five criteria.");
        }
    }

    if (sections.GEN.length > 0) {
        output.push(`The clinical significance is further established by the fact that the ${formatClinicalList(sections.GEN)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['NARCISSISTIC'] = generateNarcissisticText;