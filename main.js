import init, {
    lex,
    parse,
    compile
} from './src/whistle.js';

import  CodeMirror  from "https://cdn.jsdelivr.net/npm/codemirror@5.58.3/src/codemirror.js"

import "https://cdn.jsdelivr.net/gh/Ophyon/scripts/whistle/codemirror/mode/ext/whistle.js"

import "https://cdn.rawgit.com/beautify-web/js-beautify/v1.13.0/js/lib/beautify.js"


let mode = "lex"
let editors = [

    CodeMirror(document.querySelector("#editor"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: false,
        scrollbarStyle: null,
        mode: 'whistle',
        theme:'yonce'
    }),

    CodeMirror(document.querySelector("#tokens"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        scrollbarStyle: null,
        mode: 'whistle',
        theme:'yonce'
    }),

]


document.getElementById("lexer").addEventListener("click", function() {
  mode = "lex"
  run(editors[0].getValue())
});

document.getElementById("parser").addEventListener("click", function() {
  mode = "parse"
  run(editors[0].getValue())
});

document.getElementById("compiler").addEventListener("click", function() {
  mode = "compile"
  run(editors[0].getValue())
});

document.getElementById("helloworld").addEventListener("click", function() {
  editors[0].setValue(js_beautify(`
    fun print(txt:string):none {
        #(js) console.log(txt)
    }
  `))
});
document.getElementById("add").addEventListener("click", function() {
  editors[0].setValue(js_beautify(`
    fun add(a:i32,b:i32):i32 {
        return a+b
    }
  `))
});

async function run(code) {
    await init();
    eval(`editors[1].setValue(js_beautify(${mode}(code)))`)
}

editors[0].on('change', editor => {
    run(editor.getValue())
});
