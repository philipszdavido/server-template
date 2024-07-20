class Literal  {
    constructor(public value: string) {}
}

class Identifier {
    constructor(public name: string) {}
}

class ArrayExpression {
    constructor(public elements: Literal[]) {}
}

class ForOfStatement {
    constructor(public left: Identifier, public right: ArrayExpression | Identifier) {}
}

const evaluateForCondition = (expr: string) => {

    const exprParts = expr.split("")

    const ast = []

    let temp = ""
    let arrayDetected = false

    for (let index = 0; index < exprParts.length; index++) {
        const token = exprParts[index];

        if(!arrayDetected) {
            if(token != " ") {
                temp += token
            }

            if(token === " ") {
                ast.push(temp)
                temp = ""
            }

            if(index === exprParts.length - 1) {
                ast.push(temp)
                temp = ""
            }
        }

        if(arrayDetected) {
            temp += token
        }

        if(token === "[") {
            // start of array
            arrayDetected = true;
            temp = ""
            temp += token
        }

        if(token === "]") {
            // end of array
            arrayDetected = false;
            ast.push(temp)
            temp = ""
        }

        
    }

    return ast

}

const parseIntoArrayAstTree = (ast: string[]) => {
    
    // check the array has three elements

    const astLength = ast.length
    const middleOf = ast[1]
    const firstOf = ast[0]
    const lastEl = ast[ast.length - 1];

    if(astLength !== 3) {
        throw Error("Invalid For-Of statement.")
        return;
    }

    if(middleOf !== "of") {
        throw Error("Invalid For-Of statement.")
        return;
    }

    // check that the first element is an identifier
    if(!/^[a-zA-Z]+$/.test(firstOf)) {
        throw Error("for(item of items). The 'items' must be an identifier.")
        return;
    }

    // check if the last element is an identifier or array


    if(lastEl[0] === "[" && lastEl[lastEl.length - 1] === "]") {
        // build the array elements

        const elements = buildArrayElements(lastEl)

        // array
        const left = new Identifier(firstOf)
        const right = new ArrayExpression(elements)

        return new ForOfStatement(left , right);

    } else {
        // identifier array
        const left = new Identifier(firstOf)
        const right = new Identifier(lastEl)

        return new ForOfStatement(left , right);
        
    }

}

const buildArrayElements = (arrayString: string) => {
    // remove [ and ]
    const result = arrayString.split("").filter(token => {

        if(token == "[") {
            return false
        }

        if(token == "]") {
            return false
        }

        return true
    }).join("").split(",").map((part) => new Literal(part.trim()))

    return result
}

function isValidType(value: any) {
    const type = typeof value;

    // Check against valid JavaScript data types
    return (
        type === 'string' ||
        type === 'number' ||
        type === 'bigint' ||
        type === 'boolean' ||
        type === 'symbol' ||
        type === 'undefined' ||
        type === 'object' ||
        type === 'function'
    );
}

// console.log(evaluateForCondition("item of fruits"))
// console.log(evaluateForCondition("item of [90, 89, 34]"))
// console.log(buildArrayElements("[90, 89, 34, ]"))
const asts = evaluateForCondition("item of [90, 89, 34]")
const result = parseIntoArrayAstTree(asts)
console.log(result)
