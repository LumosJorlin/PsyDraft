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
// SOCIAL ANXIETY DISORDER DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['SOCIAL_PHOBIA'] = {
    sections: [
        { title: 'A. Primary Fear Situations', prefix: 'A', items: [
            'social interactions, such as having a conversation (1)',
            'being observed, such as eating or drinking (2)',
            'performing in front of others, such as giving a speech (3)'
        ]},
        { title: 'B & C. Cognitive/Affective Response', prefix: 'BC', items: [
            'fear of acting in a way or showing anxiety symptoms that will be negatively evaluated (B)',
            'social situations almost always provoke immediate fear or anxiety (C)'
        ]},
        { title: 'D & E. Behavioral Response', prefix: 'DE', items: [
            'social situations are avoided or endured with intense fear or anxiety (D)',
            'anxiety is disproportionate to the actual threat posed by the social situation (E)'
        ]},
        { title: 'F, G, H & I. Duration & Severity', prefix: 'FGHI', items: [
            'the fear or avoidance is persistent, typically lasting for 6 months or more (F)',
            'causes clinically significant distress or functional impairment (G)',
            'not attributable to a substance or medical condition (H)',
            'not better explained by another mental disorder (I)'
        ]},
        { title: 'Specifiers', prefix: 'SPEC', items: [
            'Performance only'
        ]}
    ]
};

// ----------------------------------------------------------------------
// SOCIAL PHOBIA TEXT GENERATION
// ----------------------------------------------------------------------
function generateSocialPhobiaText(selectedData) {
    const sections = { A: [], BC: [], DE: [], FGHI: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        const numMatch = item.text.match(/\((\d+)\)/);
        const num = numMatch ? numMatch[1] : null;

        let reference = '';
        if (item.section === 'A' && num) reference = `(A${num})`;
        else {
            const letterMatch = item.text.match(/\(([B-I])\)/);
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

    let output = ["**Diagnostic Summary: Social Anxiety Disorder (Social Phobia)**"];

    // Criterion A: The Situations
    if (sections.A.length > 0) {
        output.push(`The individual presents with marked fear or anxiety regarding ${formatClinicalList(sections.A)}.`);
    }

    // Specifier: Performance only
    if (specifiers.length > 0) {
        output.push(`This is specifically restricted to a **${formatClinicalList(specifiers)}** context.`);
    }

    // Criterion B & C: Internal State
    if (sections.BC.length > 0) {
        output.push(`This reaction is driven by a ${formatClinicalList(sections.BC)}.`);
    }

    // Criterion D & E: Behavioral Impact
    if (sections.DE.length > 0) {
        output.push(`In daily life, these ${formatClinicalList(sections.DE)}.`);
    }

    // Criteria F-I: Clinical Rigor
    if (sections.FGHI.length > 0) {
        output.push(`The clinical validity of the diagnosis is supported by findings that ${formatClinicalList(sections.FGHI)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['SOCIAL_PHOBIA'] = generateSocialPhobiaText;