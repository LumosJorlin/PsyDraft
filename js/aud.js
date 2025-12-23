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
// ALCOHOL USE DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['AUD'] = {
    sections: [
        { title: 'A. Pattern of Use', prefix: 'A', items: [
            'alcohol is often taken in larger amounts or over a longer period than intended (1)',
            'there is a persistent desire or unsuccessful efforts to cut down or control use (2)',
            'a great deal of time is spent in activities necessary to obtain, use, or recover from alcohol (3)',
            'craving, or a strong desire or urge to use alcohol (4)',
            'recurrent alcohol use resulting in a failure to fulfill major role obligations (5)',
            'continued alcohol use despite having persistent or recurrent social or interpersonal problems (6)',
            'important social, occupational, or recreational activities are given up or reduced (7)',
            'recurrent alcohol use in situations in which it is physically hazardous (8)',
            'alcohol use is continued despite knowledge of having a persistent physical or psychological problem (9)',
            'tolerance, as defined by a need for markedly increased amounts or a diminished effect (10)',
            'withdrawal, as manifested by the characteristic withdrawal syndrome or use to relieve symptoms (11)'
        ]},
        { title: 'Specifiers & Remission', prefix: 'SPEC', items: [
            'in early remission',
            'in sustained remission',
            'in a controlled environment'
        ]}
    ]
};

// ----------------------------------------------------------------------
// AUD TEXT GENERATION
// ----------------------------------------------------------------------
function generateAUDText(selectedData) {
    const sections = { A: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        const numberMatch = item.text.match(/\((\d+)\)/);
        const num = numberMatch ? numberMatch[1] : null;

        let reference = '';
        // Map prefix A + number to (A1), (A2), etc.
        if (item.section === 'A' && num) {
            reference = `(A${num})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'SPEC') {
            specifiers.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    let output = ["**Diagnostic Summary: Alcohol Use Disorder**"];

    // Main Criteria logic
    if (sections.A.length > 0) {
        const count = sections.A.length;
        let severity = "";
        if (count >= 2 && count <= 3) severity = "Mild";
        else if (count >= 4 && count <= 5) severity = "Moderate";
        else if (count >= 6) severity = "Severe";

        output.push(`The clinical presentation meets the criteria for a ${severity} Alcohol Use Disorder, evidenced by a problematic pattern of alcohol use leading to clinically significant impairment or distress.`);
        output.push(`Specifically, the individual exhibits ${formatClinicalList(sections.A)}.`);
    }

    // Remission Specifiers
    if (specifiers.length > 0) {
        output.push(`The diagnosis is further qualified by the status of ${formatClinicalList(specifiers)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['AUD'] = generateAUDText;