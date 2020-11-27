import init, {
    lex,
    parse
} from './src/whistle.js';


async function run(code) {
    await init();
    let test = code
    const data = [ lex(test), parse(test) ]
    document.getElementById("output").innerHTML = data[0]

    
}
document.getElementById("run").onclick = () => {
    let code = document.getElementById("code").value
    run(code)
}

