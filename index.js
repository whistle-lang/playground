
var Socket = new WebSocket('wss://whistlewasm.herokuapp.com/');

function sendCode(text) {
    var msg = {
        text: text,
        id:   "main",
   };
   Socket.send(JSON.stringify(msg));
}
let e1,e2,e3 = undefined;
window.onload = ()=> {
    e1 = CodeMirror.fromTextArea(document.querySelector('#editor'), {
        lineNumbers: true,
        tabSize: 2,
        theme: "darcula",
        value: '',
        mode: 'whistle',
    });
    e2 = CodeMirror.fromTextArea(document.querySelector('#outputlex'), {
        lineNumbers: true,
        tabSize: 2,
        readOnly: true,
        value: '',
        theme: "darcula",
        mode: 'whistle'
    });
    e3 = CodeMirror.fromTextArea(document.querySelector('#outputparse'), {
        lineNumbers: true,
        tabSize: 2,
        readOnly: true,
        value: '',
        theme: "darcula",
        mode: 'whistle'
    });
}

document.addEventListener ("keydown", function (zEvent) {
    if (zEvent.ctrlKey  &&  zEvent.altKey  &&  zEvent.key === "r") {  
        sendCode(e1.getValue().toString())
    }
} );

Socket.onmessage = (event)=> {
    let response = JSON.parse(event.data)
    e2.setValue(js_beautify(response.text[0]));
    e3.setValue(js_beautify(response.text[1]));
    
}

