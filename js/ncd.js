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
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}

// ----------------------------------------------------------------------
// COMPREHENSIVE NCD DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['NCD_FULL'] = {
    sections: [
        { title: '1. Severity & Independence', prefix: 'SEV', items: [
            'Major NCD: Significant cognitive decline and interference with independence in daily activities (Major)',
            'Mild NCD: Modest cognitive decline; independence in daily activities is preserved (Mild)'
        ]},
        { title: '2. Cognitive Domains Involved', prefix: 'DOM', items: [
            'Complex Attention', 'Executive Function', 'Learning and Memory', 
            'Language', 'Perceptual-Motor', 'Social Cognition'
        ]},
        { title: '3. Alzheimer’s Etiology', prefix: 'ALZ', items: [
            'Insidious onset and gradual progression (ALZ1)',
            'Clear evidence of decline in memory and learning (ALZ2)',
            'Steady progression without extended plateaus (ALZ3)'
        ]},
        { title: '4. Vascular Etiology', prefix: 'VASC', items: [
            'Deficits temporally related to cerebrovascular events (V1)',
            'Stepwise decline in functioning (V2)',
            'Decline prominent in complex attention and frontal-executive function (V3)'
        ]},
        { title: '5. Lewy Body Etiology', prefix: 'LBD', items: [
            'Fluctuating cognition with variations in attention/alertness (L1)',
            'Recurrent, detailed visual hallucinations (L2)',
            'Spontaneous parkinsonism (L3)'
        ]},
        { title: '6. Frontotemporal Etiology', prefix: 'FTD', items: [
            'Behavioral disinhibition, apathy, or loss of empathy (F1)',
            'Prominent decline in language/speech production (F2)',
            'Relative sparing of memory and perceptual-motor function (F3)'
        ]},
        { title: '7. Clinical Foundations', prefix: 'BASE', items: [
            'Deficits do not occur exclusively during delirium (C)',
            'Not better explained by another mental disorder (D)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// CONSOLIDATED GENERATOR
// ----------------------------------------------------------------------
function generateComprehensiveNCDText(selectedData) {
    const sections = { SEV: [], DOM: [], ALZ: [], VASC: [], LBD: [], FTD: [], BASE: [] };
    selectedData.forEach(item => sections[item.section]?.push(item.text.replace(/\s*\([^)]+\)\s*/g, '').trim()));

    // Determine Base Title
    let title = "Neurocognitive Disorder";
    if (sections.SEV.some(s => s.includes("Major"))) title = "Major Neurocognitive Disorder";
    if (sections.SEV.some(s => s.includes("Mild"))) title = "Mild Neurocognitive Disorder";

    let output = [`**Diagnostic Summary: ${title}**`];

    // Functional Status
    if (sections.SEV.length > 0) {
        output.push(`The presentation is characterized by ${formatClinicalList(sections.SEV)}.`);
    }

    // Cognitive Domains
    if (sections.DOM.length > 0) {
        output.push(`Impairments are specifically noted within the following domains: ${formatClinicalList(sections.DOM)}.`);
    }

    // Etiologies
    let etioFound = false;
    if (sections.ALZ.length > 0) {
        output.push(`The profile is consistent with **Alzheimer's disease**, evidenced by ${formatClinicalList(sections.ALZ)}.`);
        etioFound = true;
    }
    if (sections.VASC.length > 0) {
        output.push(`The profile indicates a **Vascular etiology**, manifested by ${formatClinicalList(sections.VASC)}.`);
        etioFound = true;
    }
    if (sections.LBD.length > 0) {
        output.push(`The profile suggests **Lewy Body disease**, based on ${formatClinicalList(sections.LBD)}.`);
        etioFound = true;
    }
    if (sections.FTD.length > 0) {
        output.push(`The profile is consistent with **Frontotemporal degeneration**, showing ${formatClinicalList(sections.FTD)}.`);
        etioFound = true;
    }

    if (!etioFound) output.push("The specific etiology remains unspecified at this time.");

    // Baseline Exclusions
    if (sections.BASE.length > 0) {
        output.push(`This formulation is confirmed as the ${formatClinicalList(sections.BASE)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['NCD_FULL'] = generateComprehensiveNCDText;