export function convertHTML(htmlString: string) {
    // Regular expressions to match the patterns
    const exprRegex = /\{\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}}/g; // Matches {{expression here}}
    const forRegex = /@for\(([^)]*)\)\s*{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}/g; // Matches @for(...) { ... }
    const ifRegex = /@if\(([^)]*)\)\s*{([^{}]*(?:\{[^{}]*\}[^{}]*)*)}/g; // Matches @if(...) { ... }

    // Replace patterns with corresponding custom tags
    let convertedHTML = htmlString;

    // Replace {{expression here}} with <expr-interpl expr="expression here"></expr-interpl>
    convertedHTML = convertedHTML.replace(exprRegex, '<expr-interpl expr="$1"></expr-interpl>');

    // Replace @for(...) { ... } with <for condition=""></for>
    convertedHTML = convertedHTML.replace(forRegex, '<for condition="$1">$2</for>');

    // Replace @if(...) { ... } with <if condition=""></if>
    convertedHTML = convertedHTML.replace(ifRegex, '<if condition="$1">$2</if>');

    return convertedHTML;
}

console.log(convertHTML(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
</head>
<body>
  <div>{{2+4}}</div>
  <div>@for(i of [7,9]) { <span>For Child <b>{{i}}</b></span> @for(ii of [2,3,4]){<strong>Strong</strong>} } <section>A section</section></div>
  <div>@if(x > 5) { <h1>My First Heading</h1> }</div>
</body>
</html>`))