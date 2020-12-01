import init, {
    lex,
    parse
} from './src/whistle.js';



async function run(code) {
    await init();
    document.querySelector('#tokens').value = lex(code)
    document.querySelector('#ast').value = parse(code)
}
document.querySelector('#editor').addEventListener('change', (event) => {
    run(event.target.value)
})