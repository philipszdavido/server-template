function convertHTML(htmlString) {
  // Regular expressions to match the patterns
  const exprRegex = /\{\{([^}]+)\}\}/g; // Matches {{expression here}}
  const forRegex = /@for\(([^)]*)\)\s*{([^}]*)}/g; // Matches @for(...) { ... }
  const ifRegex = /@if\(([^)]*)\)\s*{([^}]*)}/g; // Matches @if(...) { ... }

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

// Example usage:
const inputHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
</head>
<body>
  <div>{{someExpression}}</div>
  <div>@for(i=0; i<10; i++) { ... }</div>
  <div>@if(x > 5) { ... }</div>
</body>
</html>
`;

const convertedHTML = convertHTML(inputHTML);
console.log(convertedHTML);
