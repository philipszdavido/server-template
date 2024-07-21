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

function parseNode(node: Document | ChildNode) {

    for (let index = 0; index < node.childNodes?.length; index++) {
        const child = {...node.childNodes[index]}
        // @ts-ignore
        child.env = {...node.env, ...child?.env}
        child.childNodes?.forEach(c => {
            // @ts-ignore
            c.env = {...node.env, ...child?.env, ...c?.env}
        })

        if(child.nodeName === "expr-interpl") {

            // @ts-ignore
            const expr = child?.attrs?.[0]?.value;

                // @ts-ignore
                node.childNodes[index] = {
                    nodeName: "#text",
                    // @ts-ignore
                    value: evaluateExpr(expr, { ...node?.env, ...child?.env})
                }

        }
        
        if(child.nodeName === "for") {

            const forNode = child;
            const array = [7, 9]

            const children = evaluateForChildren(array, forNode)
            // @ts-ignore
            node.childNodes.splice(index, 1, ...[{}, ...children]);


        }

        // @ts-ignore
        child.env = {...node.env, ...child?.env}
        child.childNodes?.forEach(c => {
            // @ts-ignore
            c.env = {...node.env, ...child?.env, ...c?.env}
        })
        // console.log("======start======")
        // @ts-ignore
        // console.log("Parent: ", node?.nodeName, node?.env)
        // @ts-ignore
        // console.log("Child: ", child.nodeName, child?.env)
        // console.log("======end======")

        parseNode(child)

    }
}

parseNode(rootNode)

// @ts-ignore
const modifiedHtmlString = serialize(rootNode);

console.log(modifiedHtmlString);

function evaluateForChildren(array: number[], forNode: ChildNode) {
    const childArray: any[] = []

    array.forEach(currentArray => {

        forNode.childNodes.forEach((child:any) => {

            const childNode = {
                ...child,
                env: {
                    x: currentArray
                }
            }
            
            childArray.push({...childNode})

        })


    })

    return childArray;

}