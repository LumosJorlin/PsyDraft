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
// OPIOID USE DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['OUD'] = {
    sections: [
        { title: 'A. Pattern of Use', prefix: 'A', items: [
            'opioids are often taken in larger amounts or over a longer period than intended (1)',
            'there is a persistent desire or unsuccessful efforts to cut down or control use (2)',
            'a great deal of time is spent in activities necessary to obtain, use, or recover from opioids (3)',
            'craving, or a strong desire or urge to use opioids (4)',
            'recurrent opioid use resulting in a failure to fulfill major role obligations (5)',
            'continued opioid use despite having persistent or recurrent social or interpersonal problems (6)',
            'important social, occupational, or recreational activities are given up or reduced (7)',
            'recurrent opioid use in situations in which it is physically hazardous (8)',
            'opioid use is continued despite knowledge of having a persistent physical or psychological problem (9)',
            'tolerance, as defined by a need for markedly increased amounts or a diminished effect (10)',
            'withdrawal, as manifested by the characteristic withdrawal syndrome or use to relieve symptoms (11)'
        ]},
        { title: 'Specifiers & Remission', prefix: 'SPEC', items: [
            'in early remission',
            'in sustained remission',
            'on maintenance therapy (e.g., methadone, buprenorphine)',
            'in a controlled environment'
        ]}
    ]
};

// ----------------------------------------------------------------------
// OUD TEXT GENERATION
// ----------------------------------------------------------------------
function generateOUDText(selectedData) {
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

    let output = ["**Diagnostic Summary: Opioid Use Disorder**"];

    if (sections.A.length > 0) {
        const count = sections.A.length;
        let severity = "";
        if (count >= 2 && count <= 3) severity = "Mild";
        else if (count >= 4 && count <= 5) severity = "Moderate";
        else if (count >= 6) severity = "Severe";

        output.push(`The clinical assessment reveals a problematic pattern of opioid use leading to clinically significant impairment, meeting the threshold for a ${severity} presentation.`);
        output.push(`Diagnostic criteria are evidenced by ${formatClinicalList(sections.A)}.`);
    }

    if (specifiers.length > 0) {
        output.push(`Current clinical status is further specified as ${formatClinicalList(specifiers)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['OUD'] = generateOUDText;