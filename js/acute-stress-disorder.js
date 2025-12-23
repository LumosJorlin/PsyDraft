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
// ACUTE STRESS DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['ACUTE_STRESS'] = {
    sections: [
        { title: 'A. Traumatic Event', prefix: 'A', items: [
            'exposure to actual or threatened death, serious injury, or sexual violation (A)'
        ]},
        { title: 'B. Symptom Categories (9 required)', prefix: 'B', items: [
            'recurrent, involuntary, and intrusive distressing memories (1)',
            'recurrent distressing dreams related to the event (2)',
            'dissociative reactions/flashbacks (3)',
            'intense psychological or physiological distress at exposure to cues (4)',
            'persistent inability to experience positive emotions (5)',
            'an altered sense of the reality of one’s surroundings or oneself (6)',
            'inability to remember an important aspect of the event (7)',
            'efforts to avoid distressing memories, thoughts, or feelings (8)',
            'efforts to avoid external reminders (9)',
            'sleep disturbance (10)',
            'irritable behavior and angry outbursts (11)',
            'hypervigilance (12)',
            'problems with concentration (13)',
            'exaggerated startle response (14)'
        ]},
        { title: 'C, D & E. Duration & Impact', prefix: 'CDE', items: [
            'duration of the disturbance is 3 days to 1 month after trauma exposure (C)',
            'causes clinically significant distress or impairment (D)',
            'not attributable to a substance, medical condition, or brief psychotic disorder (E)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// ACUTE STRESS DISORDER TEXT GENERATION
// ----------------------------------------------------------------------
function generateAcuteStressText(selectedData) {
    const sections = { A: [], B: [], CDE: [] };

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

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Acute Stress Disorder**"];

    // Criterion A
    if (sections.A.length > 0) {
        output.push(`Following ${formatClinicalList(sections.A)}, the individual has developed a cluster of traumatic stress symptoms.`);
    }

    // Criterion B: The 9-symptom requirement
    if (sections.B.length > 0) {
        const count = sections.B.length;
        output.push(`Clinical evaluation identifies ${count} symptoms across the intrusion, mood, dissociative, avoidance, and arousal categories, specifically: ${formatClinicalList(sections.B)}.`);
    }

    // Criteria C, D, E: The Timing
    if (sections.CDE.length > 0) {
        output.push(`The diagnostic framework is confirmed as ${formatClinicalList(sections.CDE)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['ACUTE_STRESS'] = generateAcuteStressText;