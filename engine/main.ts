import { evaluateExpr } from "./expr_parser";
import { evaluateForCondition } from "./for_syntax_parser";
import { convertHTML } from "./html";
import {parse, serialize} from "parse5"

// Example usage:
const inputHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
</head>
<body>
  <div>{{2+4}}</div>
  <div>@for(i of [7,9]) { <h1>My First Heading</h1> }</div>
  <div>@if(x > 5) { <h1>My First Heading</h1> }</div>
</body>
</html>
`;

const convertedHTML = convertHTML(inputHTML);
const rootNode = parse(convertedHTML)

const variables = {
    x: 90
}

function parseNode(node: any) {
    if (node.childNodes) {
        node.childNodes.forEach((childNode: any, index: number) => {
            
            const nodeName = childNode.nodeName;
            const parentNode = node;

            if(nodeName === "expr-interpl") {
                const expr = childNode?.attrs?.[0]?.value;

                // @ts-ignore
                node.childNodes[index] = {
                    nodeName: "#text",
                    value: evaluateExpr(expr, variables)
                }

            }
            
            if(nodeName === "for") {
                const expr = childNode?.attrs?.[0]?.value;
                const forStatement = evaluateForCondition(expr)
                console.log(forStatement)
            }

            if(nodeName === "if") {

                const expr = childNode?.attrs?.[0]?.value;
                const result = evaluateExpr(expr, variables)

                if(result) {
                    
                    node.childNodes.splice(index, 1, ...childNode?.childNodes);

                } else {
                    node.childNodes[index] = null;
                    delete node.childNodes
                }

            }
            
            parseNode(childNode)

        });
    }
}

parseNode(rootNode)

const modifiedHtmlString = serialize(rootNode);

console.log(modifiedHtmlString);