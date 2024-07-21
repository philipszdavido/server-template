import cheerio from "cheerio"
import { convertHTML } from "./html";
import { parse, parseFragment, serialize } from "parse5";
import { evaluateExpr } from "./expr_parser";

const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
</head>
<body>
<div>{{2+4}}</div>
<div class="for">@for(i of [7,9]){<span>For Child <b>{{i}}</b></span>} <section>A section</section></div>
<div>@if(x > 5) { <h1>My First Heading</h1> }</div>
</body>
</html>
`;

// const htmlString = `
// @for(i of [7,9]){<span>ForChild</span>}
// `;

const convertedHTML = convertHTML(htmlString);

// @ts-ignore
const rootNode: Document = parse(convertedHTML)
