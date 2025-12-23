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
// SPECIFIC PHOBIA DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['SPECIFIC_PHOBIA'] = {
    sections: [
        { title: 'A. Phobic Stimulus', prefix: 'A', items: [
            'marked fear or anxiety about a specific object or situation (1)'
        ]},
        { title: 'B & C. Immediate Response', prefix: 'BC', items: [
            'the phobic object or situation almost always provokes immediate fear or anxiety (B)',
            'the phobic object or situation is actively avoided or endured with intense fear (C)'
        ]},
        { title: 'D & E. Severity & Duration', prefix: 'DE', items: [
            'the fear or anxiety is disproportionate to the actual danger posed (D)',
            'the fear, anxiety, or avoidance is persistent, typically lasting for 6 months or more (E)'
        ]},
        { title: 'F & G. Impact & Differential', prefix: 'FG', items: [
            'the disturbance causes clinically significant distress or functional impairment (F)',
            'the symptoms are not better explained by another mental disorder (G)'
        ]},
        { title: 'Phobic Type Specifiers', prefix: 'SPEC', items: [
            'Animal (e.g., spiders, dogs)',
            'Natural environment (e.g., heights, storms)',
            'Blood-injection-injury (e.g., needles, invasive medical procedures)',
            'Situational (e.g., airplanes, elevators)',
            'Other (e.g., situations that may lead to choking or vomiting)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// SPECIFIC PHOBIA TEXT GENERATION
// ----------------------------------------------------------------------
function generateSpecificPhobiaText(selectedData) {
    const sections = { A: [], BC: [], DE: [], FG: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        let reference = '';
        
        // Handle (A1) specifically
        if (item.section === 'A') {
            reference = '(A1)';
        } else {
            // Check for alphabetical criterion markers (B through G)
            const letterMatch = item.text.match(/\(([B-G])\)/);
            if (letterMatch) reference = `(${letterMatch[1]})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'SPEC') {
            specifiers.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    let output = ["**Diagnostic Summary: Specific Phobia**"];

    // Criterion A
    if (sections.A.length > 0) {
        output.push(`The clinical presentation is defined by ${formatClinicalList(sections.A)}.`);
    }

    // Specifiers (Type)
    if (specifiers.length > 0) {
        output.push(`The phobic stimulus falls under the category of ${formatClinicalList(specifiers)}.`);
    }

    // Criteria B & C
    if (sections.BC.length > 0) {
        output.push(`Exposure to the stimulus consistently triggers ${formatClinicalList(sections.BC)}.`);
    }

    // Criteria D & E
    if (sections.DE.length > 0) {
        output.push(`Diagnostic markers indicate that ${formatClinicalList(sections.DE)}.`);
    }

    // Clinical Requirements F & G
    if (sections.FG.length > 0) {
        output.push(`Furthermore, ${formatClinicalList(sections.FG)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['SPECIFIC_PHOBIA'] = generateSpecificPhobiaText;