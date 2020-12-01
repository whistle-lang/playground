import init, {
    lex,
    parse
} from './src/whistle.js';




document.querySelector('#editor').addEventListener('change', (event) => {
    await init();
    document.querySelector('#tokens').value = lex(event.target.value)
    document.querySelector('#ast').value = parse(event.target.value)
})