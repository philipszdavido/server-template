import { parseDOM } from 'htmlparser2';

// Example HTML string
const htmlString = '<div><p>Hello, <span>world!</span></p></div>';

// Parse the HTML string into a DOM structure
const dom = parseDOM(htmlString);

// Remove all span elements (example of manipulation)
dom.forEach(node => {
  if (node.type === 'tag' && node.name === 'span') {
    node.children = []; // Remove all children (including text)
  }
});

// Add a new paragraph inside the div
// dom[0].children.push({
//   type: 'tag',
//   name: 'p',
//   children: [{ type: 'text', data: 'New paragraph' }]
// });

// Serialize the modified DOM back to HTML
const modifiedHtml = serialize(dom);
console.log(modifiedHtml);
