/**
 * CLINICAL ENGINE MODULE TEMPLATE
 * Use this as a blueprint for adding new DSM-5-TR disorders.
 */

// 1. ENSURE GLOBAL REGISTRIES EXIST
// These objects act as the "brain" of your app, storing data and generation logic.
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

// 2. DEFINE THE DATA STRUCTURE
// 'UNIQUE_KEY' should be a shorthand for the disorder (e.g., 'ANOREXIA').
window.CRITERIA_DATA['UNIQUE_KEY'] = {
    sections: [
        { 
            title: 'Criterion A: Physical/Behavioral', 
            prefix: 'A', 
            items: [
                'restriction of energy intake leading to significantly low body weight (A1)',
                'intense fear of gaining weight or becoming fat (A2)',
                'disturbance in the way one\'s body weight/shape is experienced (A3)'
            ]
        },
        { 
            title: 'Mandatory Logic Gates', 
            prefix: 'GATE', 
            items: [
                'BMI is less than 18.5 (Adult) or below the 5th percentile (Child)',
                'Symptoms have persisted for at least 3 months'
            ]
        }
    ]
};

// 3. DEFINE THE TEXT GENERATOR
window.FORMULATION_GENERATORS['UNIQUE_KEY'] = function(selectedData) {
    /**
     * INITIALIZE BUCKETS
     * We group the user's selections by their 'prefix' defined above.
     */
    const sections = { A: [], GATE: [] };
    
    // Sort selected items into the correct buckets
    selectedData.forEach(item => {
        if (sections[item.section]) {
            // We strip the (A1) codes for the final text to keep it readable
            const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
            sections[item.section].push(cleanText);
        }
    });

    /**
     * LOGIC GATING
     * Here is where you define if a diagnosis is "valid" or not.
     */
    let isMet = true;
    let alerts = [];

    // Example Gate: Anorexia requires all three A criteria
    if (sections.A.length < 3) {
        isMet = false;
        alerts.push("Insufficient symptoms selected for Criterion A (3 required)");
    }

    // Example Gate: Physical requirement
    if (sections.GATE.length === 0) {
        isMet = false;
        alerts.push("Physical/Duration requirements not confirmed");
    }

    /**
     * NARRATIVE CONSTRUCTION
     * This builds the professional paragraph for the report.
     */
    let output = ["**Diagnostic Formulation: [DISORDER NAME]**"];

    // Build Sentence 1: The "What"
    if (sections.A.length > 0) {
        output.push(`The presentation is characterized by ${formatClinicalList(sections.A)}.`);
    }

    // Build Sentence 2: The "Confirmation"
    if (sections.GATE.length > 0) {
        output.push(`This is clinically confirmed by ${formatClinicalList(sections.GATE)}.`);
    }

    // Build Sentence 3: The "Warning" (If criteria aren't met)
    if (!isMet) {
        output.push(`\n**Clinical Note:** Full diagnostic criteria not yet satisfied: ${alerts.join('; ')}.`);
    }

    // Join it all into one clean string
    return output.join(' ').replace(/\s\s+/g, ' ').trim();
};

/**
 * HELPER FUNCTION: formatClinicalList
 * Converts an array ['item1', 'item2', 'item3'] into "item1, item2, and item3"
 */
function formatClinicalList(items) {
    if (!items || items.length === 0) return "";
    const cleanItems = [...items]; 
    if (cleanItems.length === 1) return cleanItems[0];
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}