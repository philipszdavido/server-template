import { convertHTML } from "./html";
import {parse} from "parse5"

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
  <div>@for(i=0; i<10; i++) { <h1>My First Heading</h1> }</div>
  <div>@if(x > 5) { <h1>My First Heading</h1> }</div>
</body>
</html>
`;

const convertedHTML = convertHTML(inputHTML);
const nodes = parse(convertedHTML)

function parseNode(nodes: any) {
    if (nodes.childNodes) {
        nodes.childNodes.forEach((node: any) => {
            console.log(node.nodeName)
            parseNode(node)
        });
    }
}

parseNode(nodes)

// console.log(convertedHTML, nodes);
