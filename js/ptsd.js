// Ensure global objects exist
window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

/**
 * Robust list formatter: Shared logic for PTSD
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
// PTSD CRITERIA DATA
// ----------------------------------------------------------------------
window.CRITERIA_DATA['PTSD'] = {
    sections: [
        { title: 'A. Trauma Exposure', prefix: 'A', items: [
            'directly experiencing the traumatic event (1)',
            'witnessing the event as it occurred to others (2)',
            'learning that the trauma occurred to a close family member or friend (3)',
            'repeated or extreme exposure to aversive details, typically work-related (4)'
        ]},
        { title: 'B. Intrusion Symptoms', prefix: 'B', items: [
            'recurrent, involuntary, and intrusive distressing memories (1)',
            'recurrent distressing dreams (2)',
            'dissociative reactions such as flashbacks (3)',
            'intense or prolonged psychological distress at exposure to cues (4)',
            'marked physiological reactions to trauma-related cues (5)'
        ]},
        { title: 'C. Avoidance', prefix: 'C', items: [
            'efforts to avoid distressing memories, thoughts, or feelings (1)',
            'avoidance of external reminders such as people, places, or situations (2)'
        ]},
        { title: 'D. Negative Alterations in Cognition/Mood', prefix: 'D', items: [
            'inability to remember important aspects of the trauma (1)',
            'persistent and exaggerated negative beliefs about oneself or the world (2)',
            'distorted cognitions about the cause or consequences of the trauma (3)',
            'persistent negative emotional state (4)',
            'markedly diminished interest in significant activities (5)',
            'feelings of detachment or estrangement from others (6)',
            'persistent inability to experience positive emotions (7)'
        ]},
        { title: 'E. Arousal & Reactivity', prefix: 'E', items: [
            'irritable behavior and angry outbursts (1)',
            'reckless or self-destructive behavior (2)',
            'hypervigilance (3)',
            'exaggerated startle response (4)',
            'problems with concentration (5)',
            'sleep disturbance (6)'
        ]},
        { title: 'F-H & Specifiers', prefix: 'FH', items: [
            'symptoms have persisted for more than one month (F)',
            'disturbance causes clinically significant distress or impairment (G)',
            'presentation is not attributable to a substance or medical condition (H)',
            'with depersonalization',
            'with derealization',
            'with delayed expression'
        ]}
    ]
};

// ----------------------------------------------------------------------
// PTSD TEXT GENERATION
// ----------------------------------------------------------------------
function generatePTSDText(selectedData) {
    const sections = { A: [], B: [], C: [], D: [], E: [], FH: [] };
    const specifiers = [];

    selectedData.forEach(item => {
        const numberMatch = item.text.match(/\((\d+)\)/);
        const num = numberMatch ? numberMatch[1] : null;

        let reference = '';
        // Map prefix (e.g., 'B') + number (e.g., '3') to (B3)
        if (['A', 'B', 'C', 'D', 'E'].includes(item.section) && num) {
            reference = `(${item.section}${num})`;
        } else if (item.text.includes('(F)')) reference = '(F)';
        else if (item.text.includes('(G)')) reference = '(G)';
        else if (item.text.includes('(H)')) reference = '(H)';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        const textWithRef = reference ? `${cleanText} ${reference}` : cleanText;

        if (item.section === 'FH' && !reference) {
            specifiers.push(textWithRef);
        } else {
            sections[item.section]?.push(textWithRef);
        }
    });

    let output = ["**Diagnostic Summary: Posttraumatic Stress Disorder**"];

    if (sections.A.length > 0) {
        output.push(`The individual’s history includes exposure to actual or threatened death, serious injury, or sexual violence through ${formatClinicalList(sections.A)}.`);
    }

    if (sections.B.length > 0) {
        output.push(`Following the trauma, the clinical picture is marked by intrusive symptoms, including ${formatClinicalList(sections.B)}.`);
    }

    if (sections.C.length > 0) {
        output.push(`Persistent avoidance of trauma-related stimuli is evidenced by ${formatClinicalList(sections.C)}.`);
    }

    if (sections.D.length > 0) {
        output.push(`Negative alterations in cognition and mood began or worsened after the event, specifically ${formatClinicalList(sections.D)}.`);
    }

    if (sections.E.length > 0) {
        output.push(`Marked alterations in arousal and reactivity are present, characterized by ${formatClinicalList(sections.E)}.`);
    }

    if (sections.FH.length > 0) {
        output.push(`Further diagnostic requirements are met as ${formatClinicalList(sections.FH)}.`);
    }

    if (specifiers.length > 0) {
        output.push(`The presentation is further characterized by ${formatClinicalList(specifiers)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['PTSD'] = generatePTSDText;