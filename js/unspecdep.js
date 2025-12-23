// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

// ----------------------------------------------------------------------
// UNSPECIFIED DEPRESSIVE DISORDER CRITERIA DATA
// ----------------------------------------------------------------------
window.CRITERIA_DATA['UnspecDep'] = {
    sections: [
        { title: 'A. Depressive Features Present', prefix: 'A', items: [
            'Client presents with clear features of a depressive disorder (A1)',
            'Sufficient criteria for a specific depressive disorder is NOT met (A2)',
            'Symptoms cause clinically significant distress or impairment (A3)'
        ]},
        { title: 'B. Reason for Unspecified Diagnosis (Select all that apply)', prefix: 'B', items: [
            'Symptoms do not meet the full criteria for any specific disorder (Subthreshold) (B1)',
            'Insufficient information to make a more specific diagnosis (B2)',
            'A time-limited diagnosis is needed (e.g., in an emergency room) (B3)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// UNSPECIFIED DEPRESSIVE DISORDER TEXT GENERATION
// ----------------------------------------------------------------------
function generateUnspecDepText(selectedData) {
    const sections = { A: [], B: [] };
    
    selectedData.forEach(item => {
        // Remove the criterion codes (A1, B2, etc.) for clean output text
        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        sections[item.section]?.push(cleanText);
    });

    let output = [];
    
    output.push("Unspecified Depressive Disorder – DSM-5-TR Documentation Snippet\n");

    if (sections.A.length > 0) {
        output.push(`Criterion A (Depressive Features): The client presents with features of a depressive disorder, as evidenced by: ${serialList(sections.A)}.`);
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
window.FORMULATION_GENERATORS['UnspecDep'] = generateUnspecDepText;
