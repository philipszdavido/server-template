class Literal  {
    constructor(value: string) {}
}

class Identifier {
    constructor(name: string) {}
}

class ArrayExpression {
    constructor(elements: Literal[]) {}
}

class ForOfStatement {
    constructor(left: Identifier, right: ArrayExpression) {}
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

    if(astLength !== 3) {
        throw Error("Invalid For-Of statement.")
        return;
    }

    if(middleOf !== "of") {
        throw Error("Invalid For-Of statement.")
        return;
    }

    // check that the first element is an identifier
    if(!/^[a-zA-Z]+$/.test(ast[0])) {
        throw Error("for(item of items). The 'items' must be an identifier.")
        return;
    }

    // check if the last element is an identifier or array

    const lastEl = ast[ast.length - 1];

    if(lastEl[0] === "[" && lastEl[lastEl.length - 1] === "]") {

    }

}

console.log(evaluateForCondition("item of fruits"))
console.log(evaluateForCondition("item of [90, 89, 34]"))
