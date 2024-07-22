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
    env?: object;
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
<div class="for">@for(i of [7,9, 10]){<span>For Child <b>{{i}}</b></span> @for(ii of [2,3,4]){<strong>Strong</strong>} } <section>A section</section></div>
<button>@for(y of [100,200]){@if(y < 100){<i>{{y}}</i>}}</button>
<div>@if(x > 5) {<h1>My First Heading</h1> }</div>
</body>
</html>
`;

const convertedHTML = convertHTML(htmlString);

// @ts-ignore
const rootNode: DocumentNode = parse(convertedHTML)

class EvaluateForNode {

    node!: DocumentNode

    private htmlString = ""

    constructor(private rootNode: DocumentNode) {

    }

    public start() {

        const rootNode = this.rootNode

        if(rootNode) {
            this.node = this.build(rootNode)
        }

        return this.htmlString

    }

    private build(node: DocumentNode) {

        const nodeName = node?.nodeName

        if(nodeName === "#comment") {
            return node
        }

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

        if(node?.env) {
            Object.entries(node?.env)
                .forEach(env => {
                    const [name, value] = env
                    this.htmlString += ` ${name}="${value}"`
                })
        }

        this.htmlString += ">"

        node.childNodes?.forEach((child) => {

            child['env'] = {... child?.env, ...node?.env, }

            this.build(child)

        })

        this.htmlString += "</" + node?.nodeName + ">"

        return node
    }

    buildForNode(forNode: DocumentNode) {

        const expr = forNode?.attrs?.[0]?.value;
        const forStatement = evaluateForCondition(expr, { })

        const forChildren = [...forNode.childNodes]
        
        if(forStatement) {

            const array = getArrayValue(forStatement, { })

            this.evaluateForChildren(array, forNode, forChildren, forStatement)

        }

        return forNode
    }

    evaluateForChildren(array: any[], forNode: DocumentNode, forChildren: any[], forStatement: ForOfStatement) {

        const childArray: any[] = []

        forChildren.forEach((child:any) => {
            childArray.push({...child})
        })

        array.forEach(currentArray => {

            childArray.forEach((child:any) => {

                const childNode = {...child,
                    env: {
                        [forStatement?.left?.name]: currentArray,
                        ...forNode?.env
                    },
                }

                // @ts-ignore
                this.build(childNode)

            })

        })

    }

}

class EvaluateNode {

    private htmlString = ""

    constructor(private forParsedHtmlString: string) {}

    start() {
        const rootNode = parse(this.forParsedHtmlString) as unknown as DocumentNode;
        this.build(rootNode)
        return this.htmlString
    }

    private build(node: DocumentNode) {

        const {
            nodeName,
            attrs,
            childNodes
        } = node;

        if(nodeName === "expr-interpl") {

            const variablesObj = {}

            attrs?.forEach(attr => {
                // @ts-ignore
                variablesObj[attr.name] = attr.value
            })

            const expr = attrs.find(attr => attr?.name === 'expr')?.value as string
            const value = evaluateExpr(expr, variablesObj);

            this.htmlString += value;

            return node

        }

        if(nodeName === "if") {

            const variablesObj = {}

            attrs?.forEach(attr => {
                // @ts-ignore
                variablesObj[attr.name] = attr.value
            })

            const condition = attrs.find(attr => attr?.name === 'condition')?.value as string
            const value = evaluateExpr(condition, variablesObj);

            if(!+value) {
                return;
            }

        }

        if(nodeName === "#comment") {
            return node
        }

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

        this.htmlString += "<" + node?.nodeName

        if(node?.attrs?.length) {
            this.htmlString += " "
            for (let index = 0; index < node?.attrs.length; index++) {

                const attr = node?.attrs[index];

                this.htmlString += attr?.name + '="' + attr?.value + '" '

            }
        }

        this.htmlString += ">"

        childNodes?.forEach((child) => {

            this.build(child)

        })

        this.htmlString += "</" + node?.nodeName + ">"

        return node

    }

}

const parsedNode = new EvaluateForNode(rootNode).start()

// console.log(parsedNode)

const finalNode = new EvaluateNode(parsedNode).start()
console.log(finalNode)


// @ts-ignore
// const modifiedHtmlString = serialize(finalNode);
//
// console.log(modifiedHtmlString);
