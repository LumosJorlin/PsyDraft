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
// ANTISOCIAL PERSONALITY DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['ASPD'] = {
    sections: [
        { title: 'A. Pattern of Disregard', prefix: 'A', items: [
            'failure to conform to social norms with respect to lawful behaviors (1)',
            'deceitfulness, such as repeated lying or use of aliases (2)',
            'impulsivity or failure to plan ahead (3)',
            'irritability and aggressiveness, indicated by repeated physical fights (4)',
            'reckless disregard for safety of self or others (5)',
            'consistent irresponsibility, such as failure to sustain work or honor debts (6)',
            'lack of remorse, as indicated by being indifferent to or rationalizing having hurt others (7)'
        ]},
        { title: 'B-D. Developmental Gateways', prefix: 'BCD', items: [
            'the individual is at least age 18 years (B)',
            'there is evidence of conduct disorder with onset before age 15 years (C)',
            'the occurrence of antisocial behavior is not exclusively during the course of schizophrenia or bipolar disorder (D)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// ASPD TEXT GENERATION
// ----------------------------------------------------------------------
function generateASPDText(selectedData) {
    const sections = { A: [], BCD: [] };

    selectedData.forEach(item => {
        const numMatch = item.text.match(/\((\d+)\)/);
        const num = numMatch ? numMatch[1] : null;

        let reference = '';
        if (item.section === 'A' && num) {
            reference = `(A${num})`;
        } else {
            const letterMatch = item.text.match(/\(([B-D])\)/);
            if (letterMatch) reference = `(${letterMatch[1]})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Antisocial Personality Disorder**"];

    if (sections.A.length > 0) {
        const count = sections.A.length;
        output.push(`The clinical presentation reveals a pervasive pattern of disregard for and violation of the rights of others, evidenced by ${count} specific behaviors: ${formatClinicalList(sections.A)}.`);
        
        if (count < 3) {
            output.push("Note: Diagnosis requires at least three criteria from section A.");
        }
    }

    // Crucial developmental context
    if (sections.BCD.length > 0) {
        output.push(`The diagnostic profile is supported by necessary developmental context, specifically that ${formatClinicalList(sections.BCD)}.`);
    } else {
        output.push("Note: Diagnosis cannot be confirmed without evidence of age requirements and history of Conduct Disorder.");
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['ASPD'] = generateASPDText;