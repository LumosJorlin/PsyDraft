// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

// ----------------------------------------------------------------------
// UNSPECIFIED TRAUMA- AND STRESSOR-RELATED DISORDER CRITERIA DATA
// ----------------------------------------------------------------------
window.CRITERIA_DATA['UnspecTrauma'] = {
    sections: [
        { title: 'A. Trauma/Stressor Features Present', prefix: 'A', items: [
            'Client exhibits symptoms characteristic of a trauma- and stressor-related disorder',
            'Full criteria for any specific disorder is NOT met',
            'Symptoms cause clinically significant distress or impairment'
        ]},
        { title: 'B. Reason for Unspecified Diagnosis (Select all that apply)', prefix: 'B', items: [
            'Symptoms do not meet the full criteria for any specific disorder (Subthreshold)',
            'Insufficient information to make a more specific diagnosis',
            'A time-limited diagnosis is needed (e.g., in an emergency room)',
            'The client meets a specific, yet unlisted, condition (Other Specified)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// UNSPECIFIED TRAUMA- AND STRESSOR-RELATED DISORDER TEXT GENERATION
// ----------------------------------------------------------------------
function generateUnspecTraumaText(selectedData) {
    const sections = { A: [], B: [] };
    
    selectedData.forEach(item => {
        const cleanText = item.text;
        sections[item.section]?.push(cleanText);
    });

    let output = [];
    
    output.push("Unspecified Trauma- and Stressor-Related Disorder – DSM-5-TR Documentation Snippet\n");

    if (sections.A.length > 0) {
        output.push(`Criterion A (Trauma/Stressor Features): The client presents with symptoms characteristic of a trauma- or stressor-related disorder, as evidenced by: ${serialList(sections.A)}.`);
    }

    if (sections.B.length > 0) {
        output.push(`\nCriterion B (Unspecified Reason): The diagnosis is designated as "unspecified" because: ${serialList(sections.B)}.`);
    }
    
    // Final cleanup
    let finalOutput = output.join(' ').trim();
    finalOutput = finalOutput.replace(/\n\s\n/g, '\n'); 
    if (finalOutput.length > 0 && finalOutput.slice(-1) !== '.') {
        finalOutput += '.';
    }

    return finalOutput;
}

// Register the function with the global generator map
window.FORMULATION_GENERATORS['UnspecTrauma'] = generateUnspecTraumaText;