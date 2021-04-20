import init, {
    lex,
    parse,
    compile
} from './src/whistle.js';

import CodeMirror from "https://cdn.jsdelivr.net/npm/codemirror@5.58.3/src/codemirror.js"

import "https://cdn.jsdelivr.net/gh/Ophyon/scripts/whistle/codemirror/mode/ext/whistle.js"

import "https://cdn.rawgit.com/beautify-web/js-beautify/v1.13.0/js/lib/beautify.js"

import { WasmToWat } from './src/wasmtowat.js';


let mode = "wasmtowat"
let editors = [

    CodeMirror(document.querySelector("#editor"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: false,
        scrollbarStyle: null,
        mode: 'whistle',
        value: `export fun add(a: i32, b: i32): i32 {
    return a + b
}`,
        theme: 'yonce'
    }),

    CodeMirror(document.querySelector("#tokens"), {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        scrollbarStyle: null,
        mode: 'whistle',
        theme: 'yonce'
    }),

]

run(editors[0].getValue())

document.getElementById("lexer").addEventListener("click", function () {
    mode = "lex"
    run(editors[0].getValue())
});

document.getElementById("parser").addEventListener("click", function () {
    mode = "parse"
    run(editors[0].getValue())
});

document.getElementById("compiler").addEventListener("click", function () {
    mode = "compile"
    run(editors[0].getValue())
});
document.getElementById("wat").addEventListener("click", function () {
    mode = "wasmtowat"
    run(editors[0].getValue())
});
document.getElementById("save-file").addEventListener("click", async function () {
    mode = "compile"
    await run(editors[0].getValue())
    let link = document.createElement('a');
    link.download = 'test.wasm';
    let bits = editors[1].getValue()
    bits = bits.slice(0, bits.lastIndexOf(",")) + bits.slice(bits.lastIndexOf(",")).replace(",", "");

    let blob = new Blob([Uint8Array.from(JSON.parse(bits))], {
        type: 'text/plain'
    });
    link.href = URL.createObjectURL(blob);

    link.click();

    URL.revokeObjectURL(link.href);

});

document.getElementById("helloworld").addEventListener("click", function () {
    editors[0].setValue(js_beautify(`
    fun print(txt:string):none {
        #(js) console.log(txt)
    }
  `))
});
document.getElementById("add").addEventListener("click", function () {
    editors[0].setValue(js_beautify(`
    export fun add(a:i32,b:i32):i32 {
        return a+b
    }
  `))
});

async function run(code) {
    await init();
    if (mode !== 'wasmtowat') {
        eval(`editors[1].setValue(js_beautify(${mode}(code)))`)
    } else {
        await editors[1].setValue(js_beautify(compile(code)))
        let bits = editors[1].getValue()
        bits = bits.slice(0, bits.lastIndexOf(",")) + bits.slice(bits.lastIndexOf(",")).replace(",", "");
        WasmToWat(Uint8Array.from(JSON.parse(bits))).then(hmm => editors[1].setValue(hmm))
    }
}

editors[0].on('change', editor => {
    run(editor.getValue())
});