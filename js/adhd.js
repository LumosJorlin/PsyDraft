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
// ADHD DATA (DSM-5-TR)
// ----------------------------------------------------------------------
window.CRITERIA_DATA['ADHD'] = {
    sections: [
        { title: 'A1. Inattention symptoms', prefix: 'A1', items: [
            'fails to give close attention to details or makes careless mistakes (a)',
            'difficulty sustaining attention in tasks or play activities (b)',
            'does not seem to listen when spoken to directly (c)',
            'does not follow through on instructions and fails to finish duties (d)',
            'difficulty organizing tasks and activities (e)',
            'avoids or dislikes tasks requiring sustained mental effort (f)',
            'loses things necessary for tasks or activities (g)',
            'easily distracted by extraneous stimuli (h)',
            'forgetful in daily activities (i)'
        ]},
        { title: 'A2. Hyperactivity & Impulsivity', prefix: 'A2', items: [
            'fidgets with or taps hands or feet, or squirms in seat (a)',
            'leaves seat in situations when remaining seated is expected (b)',
            'runs or climbs in inappropriate situations (c)',
            'unable to play or engage in leisure activities quietly (d)',
            'often "on the go," acting as if "driven by a motor" (e)',
            'talks excessively (f)',
            'blurts out an answer before a question has been completed (g)',
            'difficulty waiting one\'s turn (h)',
            'interrupts or intrudes on others (i)'
        ]},
        { title: 'B-E. Clinical Requirements', prefix: 'BE', items: [
            'several symptoms were present prior to age 12 years (B)',
            'several symptoms are present in two or more settings (C)',
            'clear evidence that symptoms interfere with social, academic, or occupational functioning (D)',
            'symptoms do not occur exclusively during a psychotic disorder and are not better explained by another mental disorder (E)'
        ]}
    ]
};

// ----------------------------------------------------------------------
// ADHD TEXT GENERATION
// ----------------------------------------------------------------------
function generateADHDText(selectedData) {
    const sections = { A1: [], A2: [], BE: [] };

    selectedData.forEach(item => {
        // Find the letter reference, e.g., "(a)"
        const letterMatch = item.text.match(/\(([a-i])\)/);
        const letter = letterMatch ? letterMatch[1] : null;

        let reference = '';
        if (item.section === 'A1' && letter) reference = `(A1${letter})`;
        else if (item.section === 'A2' && letter) reference = `(A2${letter})`;
        else if (item.text.includes('(B)')) reference = '(B)';
        else if (item.text.includes('(C)')) reference = '(C)';
        else if (item.text.includes('(D)')) reference = '(D)';
        else if (item.text.includes('(E)')) reference = '(E)';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        sections[item.section]?.push(textWithRef);
    });

    let output = ["**Diagnostic Summary: Attention-Deficit/Hyperactivity Disorder**"];

    // Presentation logic
    const hasInattention = sections.A1.length > 0;
    const hasHyperactivity = sections.A2.length > 0;

    if (hasInattention) {
        output.push(`The individual demonstrates a persistent pattern of inattention, evidenced by ${formatClinicalList(sections.A1)}.`);
    }

    if (hasHyperactivity) {
        output.push(`The clinical picture also includes symptoms of hyperactivity and impulsivity, specifically ${formatClinicalList(sections.A2)}.`);
    }

    // Diagnostic requirements B-E
    if (sections.BE.length > 0) {
        output.push(`Diagnostic threshold is met as ${formatClinicalList(sections.BE)}.`);
    }

    // Determination of Presentation Type
    if (hasInattention && hasHyperactivity) {
        output.push("This clinical profile is consistent with the **Combined Presentation**.");
    } else if (hasInattention) {
        output.push("This clinical profile is consistent with the **Predominantly Inattentive Presentation**.");
    } else if (hasHyperactivity) {
        output.push("This clinical profile is consistent with the **Predominantly Hyperactive/Impulsive Presentation**.");
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['ADHD'] = generateADHDText;