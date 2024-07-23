export function convertHTML(htmlString: string) {
    // Regular expressions to match the patterns
    const exprRegex = /\{\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}}/g; // Matches {{expression here}}
    // const forRegex = /@for\(([^)]*)\)\s*{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}/g; // Matches @for(...) { ... }
    const forRegex = /@for\s*\(([^)]*)\)\s*{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}/g;
    // const ifRegex = /@if\(([^)]*)\)\s*{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}/g; // Matches @if(...) { ... }
    const ifRegex = /@if\s*\(([^)]*)\)\s*{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}/g;

    // Replace patterns with corresponding custom tags
    let convertedHTML = htmlString;

    // Replace {{expression here}} with <expr-interpl expr="expression here"></expr-interpl>
    while(/\{\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}}/g.test(convertedHTML)) {

        convertedHTML = convertedHTML.replace(exprRegex, '<expr-interpl expr="$1"></expr-interpl>');

    }

    // Replace @for(...) { ... } with <for condition=""></for>
    while(/@for\(([^)]*)\)\s*{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}/g.test(convertedHTML)) {

        convertedHTML = convertedHTML.replace(forRegex, '<for condition="$1">$2</for>');

    }

    // Replace @if(...) { ... } with <if condition=""></if>
    while(/@if\(([^)]*)\)\s*{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}/g.test(convertedHTML)) {

        convertedHTML = convertedHTML.replace(ifRegex, '<if condition="$1">$2</if>');

    }

    return convertedHTML;
}