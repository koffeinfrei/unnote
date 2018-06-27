// phantomjs script to convert any html to quill compliant html.
//
// @input
//   a filename containing the input markup as the first argument to the script
//
// @output
//   the converted html printed to stdout
//
// @example
//   $ phantomjs quill_format.js /tmp/content.html

var system = require('system');
var fs = require('fs');
var Quill = require('../../../../client/node_modules/quill/dist/quill.js');

// create a div to initialize quill
var container = document.createElement('div');
document.body.appendChild(container);

// the input is read from the file provided by the first argument
var content = fs.read(system.args[1]);

// use quill's api to convert the html
var quill = new Quill(container);
content = quill.clipboard.dangerouslyPasteHTML(content, 'silent');
quill.update();

// output the result to stdout
console.log(quill.root.innerHTML);

phantom.exit();
