import init, {
    lex,
    parse
} from './src/whistle.js';

import CodeMirror from "https://cdn.jsdelivr.net/npm/codemirror@5.58.3/src/codemirror.js"
import "https://cdn.jsdelivr.net/gh/Ophyon/whistle-editor/mode/whistle/whistleinit.js"

let editors = [

    CodeMirror(document.querySelector("#editor"), {
        lineNumbers: true,
        lineWrapping: true,
        mode: 'whistle',
        theme:'yonce'
    }),

    CodeMirror(document.querySelector("#tokens"), {
        lineNumbers: true,
        lineWrapping: true,
        mode: 'whistle',
        theme:'yonce'
    }),

    CodeMirror(document.querySelector("#ast"), {
        lineNumbers: true,
        lineWrapping: true,
        mode: 'whistle',
        theme:'yonce'
    })
]


async function run(code) {
    await init();
    editors[1].setValue(lex(code))
    editors[2].setValue(parse(code))
}

editors[0].on('change', editor => {
    run(editor.getValue())
});