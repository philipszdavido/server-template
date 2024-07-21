
const operators = ["+", "-", "*", "/", "<", ">"]

const isNumber = (token: any) => {
    return !Number.isNaN(+token)
}

const isNotNumber = (token: any) => {
    return !!Number.isNaN(+token)
}

const isOperator = (token: any) => {
    return operators.includes(token)
}

const isNotOperator = (token: any) => {
    return !operators.includes(token)
}

function parseTokens(expr: string) {

    const ast = []

    const tokens = expr.split('')

    let temp = ""

    for (let index = 0; index < tokens.length; index++) {

        const token = tokens[index];

        // check token is number
        if(isNumber(token)) {
            temp += token;
        }

        if(isOperator(token)) {

            ast.push(temp)

            ast.push(token)

            temp = ""

        }

        if(isNotOperator(token) && isNotNumber(token)) {
            temp += token

            const nextToken = tokens?.[index + 1];

            if(nextToken) {

                if(isOperator(token) || isNumber(token)) {
                    ast.push(temp)
                    temp = ""
                }

            }

        }

        if(index === tokens.length - 1) {
            ast.push(temp)
        }
        
    }

    return ast

}

function evaluateAst(ast: string[]) {

    let acc = 0;

    for (let index = 0; index < ast.length; index++) {

        const currentAst = ast[index];
        const nextAst = ast?.[index + 1]

        if(!Number.isNaN(+currentAst) && index == 0) {
            acc = +currentAst
        }

        if(operators.includes(currentAst)) {
            
            switch (currentAst) {

                case '+':
                    if(nextAst) {
                        acc = acc + +nextAst
                        index = index + 1
                    }
                    break;

                case '-':
                    if(nextAst) {
                        acc = acc - +nextAst
                        index = index + 1
                    }
                    break;

                case '*':
                    if(nextAst) {
                        acc = acc * +nextAst
                        index = index + 1
                    }
                    break;

                case '/':
                    if(nextAst) {
                        acc = acc / +nextAst
                        index = index + 1
                    }
                    break;

                case '>':
                    if(nextAst) {
                        acc = acc > +nextAst ? 1 : 0
                        index = index + 1
                    }
                    break;

                case '<':
                    if(nextAst) {
                        acc = acc < +nextAst ? 1 : 0
                        index = index + 1
                    }
                    break;
                                            
                default:
                    break;
            }
            
        }
        
    }
    return acc
}

function replaceVariables(ast: string[], variables: any) {

    return ast.map((currentAst: string) => {
        
        const value = variables?.[currentAst?.trim()];

        if(value) {
            return value
        }

        return currentAst?.trim();

    })

}

export const evaluateExpr = (expr: string, variables: object) => {
    console.log(variables)
    const ast = parseTokens(expr)
    const refinedAst = replaceVariables(ast, variables)
    const result = evaluateAst(refinedAst)
    return result?.toString()
}

// console.log(evaluateExpr("22+3-45* 3", {}))
// console.log(evaluateExpr("22+3-45* 3+uu", {uu: 90}))
// console.log(evaluateExpr("x > 5", {x: 90}))

