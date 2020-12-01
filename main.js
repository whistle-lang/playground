import init, {
    lex,
    parse
} from './src/whistle.js';

import CodeMirror from "https://cdn.jsdelivr.net/npm/codemirror@5.58.3/src/codemirror.js"

import "https://cdn.jsdelivr.net/gh/Ophyon/whistle-editor/mode/whistle/whistleinit.js"

import "https://cdn.rawgit.com/beautify-web/js-beautify/v1.13.0/js/lib/beautify.js"

let editors = [

    CodeMirror(document.querySelector("#editor"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: false,
        mode: 'whistle',
        theme:'yonce'
    }),

    CodeMirror(document.querySelector("#tokens"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        mode: 'whistle',
        theme:'yonce'
    }),

    CodeMirror(document.querySelector("#ast"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        mode: 'whistle',
        theme:'yonce'
    })
]


async function run(code) {
    await init();
    editors[1].setValue(js_beautify(lex(code)))
    editors[2].setValue(js_beautify(parse(code)))
}

editors[0].on('change', editor => {
    run(editor.getValue())
});