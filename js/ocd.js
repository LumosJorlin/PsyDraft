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
// OCD DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['OCD'] = {
    sections: [
        { title: 'A1. Obsessions', prefix: 'A1', items: [
            'recurrent and persistent thoughts, urges, or images that are intrusive and unwanted (a)',
            'the individual attempts to ignore or suppress such thoughts, or to neutralize them with some other thought or action (b)'
        ]},
        { title: 'A2. Compulsions', prefix: 'A2', items: [
            'repetitive behaviors or mental acts that the individual feels driven to perform in response to an obsession (a)',
            'the behaviors or mental acts are aimed at preventing or reducing anxiety or distress, or preventing a dreaded event (b)'
        ]},
        { title: 'B, C & D. Clinical Requirements', prefix: 'BCD', items: [
            'the obsessions or compulsions are time-consuming, taking more than 1 hour per day (B)',
            'symptoms cause clinically significant distress or impairment (B)',
            'the obsessive-compulsive symptoms are not attributable to the physiological effects of a substance (C)',
            'the disturbance is not better explained by the symptoms of another mental disorder (D)'
        ]},
        { title: 'Insight Specifiers', prefix: 'SPEC', items: [
            'With good or fair insight',
            'With poor insight',
            'With absent insight/delusional beliefs',
            'Tic-related'
        ]}
    ]
};

// ----------------------------------------------------------------------
// OCD TEXT GENERATION
// ----------------------------------------------------------------------
function generateOCDText(selectedData) {
    const sections = { A1: [], A2: [], BCD: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        const letterMatch = item.text.match(/\(([a-d])\)/);
        const letter = letterMatch ? letterMatch[1] : null;

        let reference = '';
        if (item.section === 'A1' && letter) reference = `(A1${letter})`;
        else if (item.section === 'A2' && letter) reference = `(A2${letter})`;
        else {
            const capLetterMatch = item.text.match(/\(([B-D])\)/);
            if (capLetterMatch) reference = `(${capLetterMatch[1]})`;
        }

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'SPEC') {
            specifiers.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    let output = ["**Diagnostic Summary: Obsessive-Compulsive Disorder**"];

    // Criterion A: Obsessions & Compulsions
    if (sections.A1.length > 0) {
        output.push(`The clinical presentation is characterized by the presence of obsessions, specifically ${formatClinicalList(sections.A1)}.`);
    }

    if (sections.A2.length > 0) {
        output.push(`In response to these intrusions, the individual engages in compulsions manifested as ${formatClinicalList(sections.A2)}.`);
    }

    // Criteria B, C, D: Severity and Exclusion
    if (sections.BCD.length > 0) {
        output.push(`These symptoms meet diagnostic thresholds as ${formatClinicalList(sections.BCD)}.`);
    }

    // Specifiers
    if (specifiers.length > 0) {
        output.push(`The presentation is further specified as ${formatClinicalList(specifiers)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['OCD'] = generateOCDText;