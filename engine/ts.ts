import cheerio from "cheerio"
import { convertHTML } from "./html";
import { parse, parseFragment, serialize } from "parse5";
import { evaluateExpr } from "./expr_parser";
import {evaluateForCondition, ForOfStatement, getArrayValue} from "./for_syntax_parser";
import { evaluateForChildren } from "./main";

type DocumentNode = {
    childNodes: Array<DocumentNode>;
    nodeName: string;
    tagName:  string;
    value?: string;
    attrs: Array<{
        name: string;
        value: string;
    }>
}

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
const rootNode: DocumentNode = parse(convertedHTML)

class BuildNodes {

    node!: DocumentNode

    private htmlString = ""

    constructor(public rootNode: DocumentNode) {

    }

    public start() {

        const rootNode = this.rootNode

        if(rootNode) {
            this.node = this.build(rootNode)
        }

        //return this.node

        return this.htmlString

    }

    private build(node: DocumentNode) {

        const nodeName = node?.nodeName

        // const newNode = {
        //     childNodes: []
        // } as unknown as  DocumentNode

        // newNode['nodeName'] = node?.nodeName;
        // newNode['tagName']= node?.tagName;
        // newNode['attrs']= node?.attrs;
        // newNode['childNodes'] = []

        if(nodeName === "#document") {
            node.childNodes?.forEach((child) => {
                this.build(child)
            })
    
            return node;
        }

        if (nodeName === "#documentType") {
            node.childNodes?.forEach((child) => {
                this.build(child)
            })
    
            return node;
            
        }

        if (nodeName === "#text") {
            this.htmlString += node?.value
            return node
        }

        if (nodeName === "for") {
            return this.buildForNode(node)
        }


        this.htmlString += "<" + node?.nodeName

        if(node?.attrs?.length) {
            this.htmlString += " "
            for (let index = 0; index < node?.attrs.length; index++) {

                const attr = node?.attrs[index];

                this.htmlString += attr?.name + '="' + attr?.value + '"'
                
            }
        }

        this.htmlString += ">"



        node.childNodes?.forEach((child) => {
            this.build(child)
            //const newChildNode = this.build(child)
            //newNode['childNodes'].push(newChildNode)
        })

        this.htmlString += "</" + node?.nodeName + ">"


        //return newNode;

        return node
    }

    buildForNode(forNode: DocumentNode) {

        const expr = forNode?.attrs?.[0]?.value;
        const forStatement = evaluateForCondition(expr, { })

        const forChildren = forNode.childNodes
        
        if(forStatement) {

            const array = getArrayValue(forStatement, { })

            this.evaluateForChildren(array, forChildren, forStatement)

        }

        return forNode
    }

    evaluateForChildren(array: any[], forChildren: any[], forStatement: ForOfStatement) {

        // const childArray: any[] = []

        array.forEach(currentArray => {

            forChildren.forEach((child:any) => {

                const childNode = {...child,
                    env: {
                        [forStatement?.left?.name]: currentArray
                    },
                    attrs: [
                        ...child.attrs,
                        {
                            name: forStatement?.left?.name,
                            value: currentArray
                        }
                    ]
                }

                this.build(childNode)


                //childArray.push({...childNode})

            })


        })

        //return childArray.map(c => ({...c}));

    }

}

const parsedNode = new BuildNodes(rootNode).start()

console.log(parsedNode)

// @ts-ignore
// const modifiedHtmlString = serialize(parsedNode);

// console.log(modifiedHtmlString);
