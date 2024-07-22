import { convertHTML } from "./html";
import { parse } from "parse5";
import { evaluateExpr } from "./expr_parser";
import {evaluateForCondition, ForOfStatement, getArrayValue} from "./for_parser";

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

export class EvaluateForNode {

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
        const forStatement = evaluateForCondition(expr)

        const forChildren = [...forNode.childNodes]
        
        if(forStatement) {

            const array = getArrayValue(forStatement, { })

            console.log(array, forStatement, expr)

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

export class EvaluateNode {

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

export default function main(html: string){

    const convertedHTML = convertHTML(html);

    // @ts-ignore
    const rootNode: DocumentNode = parse(convertedHTML)

    const parsedNode = new EvaluateForNode(rootNode).start()

    const finalNode = new EvaluateNode(parsedNode).start()

    return finalNode

}