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
    if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`;
    const lastItem = cleanItems.pop();
    return `${cleanItems.join(', ')}, and ${lastItem}`;
}

window.CRITERIA_DATA['BIPOLAR_I'] = {
    sections: [
        { title: 'A. Mood & Energy Elevation', prefix: 'A', items: [
            'abnormally and persistently elevated, expansive, or irritable mood (1)',
            'abnormally and persistently increased goal-directed activity or energy (2)'
        ]},
        { title: 'B. Behavioral Manifestations', prefix: 'B', items: [
            'inflated self-esteem or grandiosity (1)',
            'decreased need for sleep, such as feeling rested after only 3 hours (2)',
            'more talkative than usual or pressure to keep talking (3)',
            'flight of ideas or subjective experience that thoughts are racing (4)',
            'distractibility as reported or observed (5)',
            'increase in goal-directed activity or psychomotor agitation (6)',
            'excessive involvement in activities with a high potential for painful consequences (7)'
        ]},
        { title: 'C & D. Impairment & Exclusion', prefix: 'CD', items: [
            'mood disturbance is sufficiently severe to cause marked impairment in social or occupational functioning (C)',
            'requires hospitalization to prevent harm to self or others (C)',
            'presence of psychotic features (C)',
            'episode is not attributable to the physiological effects of a substance or medical condition (D)'
        ]}
    ]
};

function generateBipolarIText(selectedData) {
    const sections = { A: [], B: [], CD: [] };
    selectedData.forEach(item => {
        const num = (item.text.match(/\((\d+)\)/) || [])[1];
        let ref = '';
        if (['A', 'B'].includes(item.section) && num) ref = `(${item.section}${num})`;
        else if (item.text.includes('(C)')) ref = '(C)';
        else if (item.text.includes('(D)')) ref = '(D)';

        const cleanText = item.text.replace(/\s*\([^)]+\)\s*/g, '').trim();
        sections[item.section]?.push(ref ? `${cleanText} ${ref}` : cleanText);
    });

    let output = ["**Diagnostic Summary: Bipolar I Disorder, Manic Episode**"];

    if (sections.A.length > 0) {
        output.push(`The individual is currently presenting with a distinct period of mood disturbance characterized by ${formatClinicalList(sections.A)}. This period has persisted for at least one week and is present most of the day, nearly every day.`);
    }

    if (sections.B.length > 0) {
        output.push(`During this interval of increased energy, the clinical picture is further complicated by ${formatClinicalList(sections.B)}.`);
    }

    if (sections.CD.length > 0) {
        output.push(`The severity of this episode is clinically significant, as evidenced by the fact that the ${formatClinicalList(sections.CD)}.`);
    }

    return output.join(' ').replace(/\s\s+/g, ' ').trim();
}
window.FORMULATION_GENERATORS['BIPOLAR_I'] = generateBipolarIText;