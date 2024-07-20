import { evaluateExpr } from "./expr_parser";
import { evaluateForCondition, ForOfStatement, getArrayValue } from "./for_syntax_parser";
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
<div>@for(i of [7,9]){<span>For Child <b>{{i}}</b></span>} <section>A section</section></div>
<div>@if(x > 5) { <h1>My First Heading</h1> }</div>
</body>
</html>
`;

const convertedHTML = convertHTML(inputHTML);
const rootNode = parse(convertedHTML)

const variables = {
    x: 90
}

function parseNode(node: any, env: any) {
    if (node.childNodes) {
        const childNodes = node.childNodes
        for (let index = 0; index < childNodes.length; index++) {

            const childNode = childNodes[index];

            const nodeName = childNode.nodeName;
            const parentNode = node;
            const localEnv = childNode?.env

            if(nodeName === "expr-interpl") {
                const expr = childNode?.attrs?.[0]?.value;

                console.log(childNode)

                // @ts-ignore
                node.childNodes[index] = {
                    nodeName: "#text",
                    value: evaluateExpr(expr, { ...variables, ...env, ...localEnv})
                }

            }
            
            if(nodeName === "for") {
                const forNode = childNode
                const expr = forNode?.attrs?.[0]?.value;
                const forStatement = evaluateForCondition(expr, { ...variables, ...env, ...localEnv})

                const forChildren = forNode.childNodes

                if(forStatement) {

                    const array = getArrayValue(forStatement, { ...variables, ...env, ...localEnv})

                    const childrenArray = evaluateForChildren(array, forChildren, forStatement)

                    //console.log(childrenArray)

                    node.childNodes.splice(index, 1, ...childrenArray);

                }


                // console.log(forStatement)
            }

            if(nodeName === "if") {

                const expr = childNode?.attrs?.[0]?.value;
                const result = evaluateExpr(expr, { ...variables, ...env, ...localEnv})

                if(result) {
                    
                    node.childNodes.splice(index, 1, ...childNode?.childNodes);

                } else {
                    node.childNodes[index] = null;
                    delete node.childNodes
                }

            }
            
            if (childNode?.childNodes) {
                childNode?.childNodes.forEach((child: any) => {
                    child.env = {...childNode?.env, ...child?.env}
                })
            }

            parseNode(childNode, null)

        }
    }
}

parseNode(rootNode, variables)

const modifiedHtmlString = serialize(rootNode);

console.log(modifiedHtmlString);

function evaluateForChildren(array: any[], forChildren: any[], forStatement: ForOfStatement) {
    const childArray: any[] = []

    array.forEach(currentArray => {

        forChildren.forEach((child:any) => {
            
            child.env = {
                [forStatement?.left?.name]: currentArray
            }

            // console.log(child.env)

            childArray.push({...child})

        })


    })

    if(childArray) {
        childArray.forEach((child: any) => {

            if (child?.childNodes) {

                child?.childNodes.forEach((childNode: any) => {
                    child.env = {...child?.env, ...childNode?.env}
                })

            }

        })
    }

    //console.log(childArray)
    return childArray;

}