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
// CANNABIS USE DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['CUD'] = {
    sections: [
        { title: 'A. Pattern of Use', prefix: 'A', items: [
            'cannabis is often taken in larger amounts or over a longer period than intended (1)',
            'there is a persistent desire or unsuccessful efforts to cut down or control use (2)',
            'a great deal of time is spent in activities necessary to obtain, use, or recover from cannabis (3)',
            'craving, or a strong desire or urge to use cannabis (4)',
            'recurrent cannabis use resulting in a failure to fulfill major role obligations (5)',
            'continued cannabis use despite having persistent or recurrent social or interpersonal problems (6)',
            'important social, occupational, or recreational activities are given up or reduced (7)',
            'recurrent cannabis use in situations in which it is physically hazardous (8)',
            'cannabis use is continued despite knowledge of having a persistent physical or psychological problem (9)',
            'tolerance, as defined by a need for markedly increased amounts or a diminished effect (10)',
            'withdrawal, as manifested by the characteristic withdrawal syndrome or use to relieve symptoms (11)'
        ]},
        { title: 'Specifiers & Remission', prefix: 'SPEC', items: [
            'In early remission',
            'In sustained remission',
            'In a controlled environment'
        ]}
    ]
};

// ----------------------------------------------------------------------
// CUD TEXT GENERATION
// ----------------------------------------------------------------------
function generateCUDText(selectedData) {
    const sections = { A: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        const numberMatch = item.text.match(/\((\d+)\)/);
        const num = numberMatch ? numberMatch[1] : null;

        let reference = '';
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

    let output = ["**Diagnostic Summary: Cannabis Use Disorder**"];

    if (sections.A.length > 0) {
        const count = sections.A.length;
        let severity = "";
        if (count >= 2 && count <= 3) severity = "Mild";
        else if (count >= 4 && count <= 5) severity = "Moderate";
        else if (count >= 6) severity = "Severe";

        output.push(`The clinical presentation is consistent with a ${severity} Cannabis Use Disorder, based on a problematic pattern of use leading to significant impairment or distress.`);
        output.push(`Specifically, the individual demonstrates ${formatClinicalList(sections.A)}.`);
    }

    if (specifiers.length > 0) {
        output.push(`Current status is further specified as ${formatClinicalList(specifiers)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['CUD'] = generateCUDText;