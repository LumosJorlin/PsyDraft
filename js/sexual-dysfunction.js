window.CRITERIA_DATA = window.CRITERIA_DATA || {};
window.FORMULATION_GENERATORS = window.FORMULATION_GENERATORS || {};

window.CRITERIA_DATA['SEX_DYS_EXHAUSTIVE'] = {
    sections: [
        { title: 'A. Erectile Disorder (1+ Required)', prefix: 'ED', items: [
            'marked difficulty in obtaining an erection during sexual activity (1)',
            'marked difficulty in maintaining an erection until completion (2)',
            'marked decrease in erectile rigidity (3)'
        ]},
        { title: 'A. Female Interest/Arousal (3+ Required)', prefix: 'FSIAD', items: [
            'absent/reduced interest in sexual activity (1)',
            'absent/reduced sexual or erotic thoughts or fantasies (2)',
            'no or reduced initiation of sexual activity/unreceptiveness to partner (3)',
            'absent/reduced sexual excitement/pleasure in 75-100% of encounters (4)',
            'absent/reduced sexual interest/arousal in response to cues (5)',
            'absent/reduced genital or nongenital sensations in 75-100% of encounters (6)'
        ]},
        { title: 'A. Genito-Pelvic Pain/Penetration (1+ Required)', prefix: 'GPP', items: [
            'persistent difficulty with vaginal penetration during intercourse (1)',
            'marked vulvovaginal or pelvic pain during intercourse/penetration (2)',
            'marked anxiety/fear of pain in anticipation of penetration (3)',
            'marked tensing/contraction of pelvic floor muscles during attempted penetration (4)'
        ]},
        { title: 'B-D. Mandatory Gates (ALL Required)', prefix: 'GATE', items: [
            'symptoms persisted for a minimum duration of approximately 6 months (B)',
            'symptoms cause clinically significant distress (C)',
            'not better explained by a nonsexual mental disorder (D1)',
            'not attributable to severe relationship distress (D2)',
            'not attributable to a substance, medication, or medical condition (D3)'
        ]}
    ]
};

function generateExhaustiveSexDysText(selectedData) {
    const sections = { ED: [], FSIAD: [], GPP: [], GATE: [] };
    selectedData.forEach(item => sections[item.section]?.push(item.text.replace(/\s*\([^)]+\)\s*/g, '').trim()));

    let output = ["**Comprehensive Diagnostic Formulation**"];
    let isDiagnosisMet = true;
    let errors = [];

    // 1. Check Thresholds for Criterion A
    if (sections.ED.length > 0) {
        output.push(`Erectile dysfunction symptoms include ${formatClinicalList(sections.ED)}.`);
    } else if (sections.FSIAD.length > 0) {
        if (sections.FSIAD.length < 3) {
            isDiagnosisMet = false;
            errors.push("threshold for FSIAD (3 symptoms) not met");
        }
        output.push(`Female sexual interest/arousal deficits are manifested by ${formatClinicalList(sections.FSIAD)}.`);
    } else if (sections.GPP.length > 0) {
        output.push(`Genito-pelvic pain/penetration difficulties are evidenced by ${formatClinicalList(sections.GPP)}.`);
    } else {
        isDiagnosisMet = false;
        errors.push("no primary symptom (Criterion A) selected");
    }

    // 2. Check Mandatory Gates (B, C, D)
    const requiredGateCount = 5; // B, C, D1, D2, D3
    if (sections.GATE.length < requiredGateCount) {
        isDiagnosisMet = false;
        const missing = requiredGateCount - sections.GATE.length;
        errors.push(`${missing} mandatory gate(s) (Duration/Distress/Exclusions) missing`);
    }

    // 3. Final Narrative Construction
    if (sections.GATE.length > 0) {
        output.push(`The clinical requirements are satisfied as the ${formatClinicalList(sections.GATE)}.`);
    }

    if (!isDiagnosisMet) {
        output.push(`\n**Clinical Warning:** Full diagnostic criteria for a formal Sexual Dysfunction are not yet satisfied due to: ${errors.join('; ')}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}

window.FORMULATION_GENERATORS['SEX_DYS_EXHAUSTIVE'] = generateExhaustiveSexDysText;