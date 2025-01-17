import {convertHTML} from "../engine/html";
import {parse} from "parse5";
import {EvaluateForNode, EvaluateNode} from "../engine";

const htmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
</head>
<body>
    <div>{{2+4+9}}</div>
    <div class="for">@for(i of [7,9, 10]){<span>For Child <b>{{i}}</b></span> @for(ii of [2,3,4]){<strong>Strong</strong>} } <section>A section</section></div>
    <button>@for(y of [100,200]){@if(y < 100){<i>{{y}}</i>}}</button>

    <div> @if (x > 5) {<h1>My First Heading</h1> }</div>

      @for (fruit of [ 'mango' , 'orange' ]) {
        <i>{{ fruit }}</i>
      }

</body>
</html>
`;


const convertedHTML = convertHTML(htmlString);

// @ts-ignore
const rootNode: DocumentNode = parse(convertedHTML)

const parsedNode = new EvaluateForNode(rootNode, { name: 'nnamdi'}).start()

// console.log(parsedNode)

const finalNode = new EvaluateNode(parsedNode).start()
console.log(finalNode)


// @ts-ignore
// const modifiedHtmlString = serialize(finalNode);
//
// console.log(modifiedHtmlString);
