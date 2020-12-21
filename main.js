import init, {
    lex,
    parse,
    compile
} from './src/whistle.js';

import  CodeMirror  from "https://cdn.jsdelivr.net/npm/codemirror@5.58.3/src/codemirror.js"

import "https://cdn.jsdelivr.net/gh/Ophyon/scripts/whistle/codemirror/mode/ext/whistle.js"

import "https://cdn.rawgit.com/beautify-web/js-beautify/v1.13.0/js/lib/beautify.js"

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

    CodeMirror(document.querySelector("#ast"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        scrollbarStyle: null,
        mode: 'whistle',
        theme:'yonce'
    }),
    CodeMirror(document.querySelector("#wasm"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        scrollbarStyle: null,
        mode: 'whistle',
        theme:'yonce'
    })
]


async function run(code) {
    await init();
    editors[1].setValue(js_beautify(lex(code)))
    editors[2].setValue(js_beautify(parse(code)))
    editors[3].setValue(js_beautify(compile(code)))
}

editors[0].on('change', editor => {
    run(editor.getValue())
});
