let Socket = new WebSocket('wss://whistlewasm.herokuapp.com')//whistlewasm.fly.dev
let editors = []

require.config({
    paths: {
        vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/'
    }
});

require(['vs/editor/editor.main'], function () {
    monaco.languages.register({
        id: 'whistle'
    });
    monaco.languages.setMonarchTokensProvider('whistle', {

        keywords: [
            "import",
            "as",
            "from",
            "export",
            "fun",
            "return",
            "if",
            "else",
            "while",
            "break",
            "continue",
            "var",
            "val",
            "none",
            "for",
            "in",
            "match",
            "type",
            "struct",
            "trait"
        ],
    
        typeKeywords: [
            "none", "string", "bool", "i8", "i16", "i32", "i64", "u8", "u16", "u32", "u64", "f32", "f64"
        ],
    
        operators: [
            "&&=", "||=", "&&", "||", "!", "+=",
            "-=", "*=", "/=", "%=", "**=", "+", "-",
            "*", "/", "%", "**", "<<=", ">>=", "<<",
            ">>", "&=", "|=", "^=", "&", "|", "^",
            "~", "==", "!=", "<=", ">=", "<", ">", "="
        ],
    
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
    
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    
        tokenizer: {
            root: [
                [/#\([a-zA-Z]\w*\)/, 'annotation'],
                [/[a-z_$][\w$]*/, {
                    cases: {
                        '@typeKeywords': 'keyword',
                        '@keywords': 'keyword',
                        '@default': 'identifier'
                    }
                }],
                [/[A-Z][\w\$]*/, 'type.identifier'],
                { include: '@whitespace' },
                [/[{}()\[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [/@symbols/, {
                    cases: {
                        '@operators': 'operator',
                        '@default': ''
                    }
                }],
    
                [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],
    
                [/[;,.]/, 'delimiter'],
    
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
    
                [/'[^\\']'/, 'string'],
                [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                [/'/, 'string.invalid']
            ],
    
            comment: [
                [/[^\/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'],
                ["\\*/", 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],
    
            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],
    
            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],
        },
    });


    editors[0] = monaco.editor.create(document.getElementById('editor'), {
        theme: 'vs-dark',
        value: "",
        padding: 10,
        readOnly: false,
        language: 'whistle',
        automaticLayout: true

    });
    editors[1] = monaco.editor.create(document.getElementById('tokens'), {
        theme: 'vs-dark',
        value: "",
        readOnly: true,
        language: 'javascript',
        automaticLayout: true
    });
    editors[2] = monaco.editor.create(document.getElementById('ast'), {
        theme: 'vs-dark',
        value: "",
        readOnly: true,
        language: 'javascript',
        automaticLayout: true
    });
    editors[0].onDidChangeModelContent(function (e) {
        sendCode(editors[0].getValue())
    })
    function sendCode(text) {
        let msg = {
            text: text,
            id: "main",
        }
        Socket.send(JSON.stringify(msg))
    }
    
    Socket.onmessage = (event) => {
        let response = JSON.parse(event.data)
        editors[1].setValue(js_beautify(response.text[0]))
        editors[2].setValue(js_beautify(response.text[1]))
    }

});
