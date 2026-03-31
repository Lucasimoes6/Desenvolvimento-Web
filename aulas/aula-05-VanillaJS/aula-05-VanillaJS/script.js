const randomImage = document.getElementById('randomImage');
if (randomImage) {
    randomImage.src = 'https://picsum.photos/300/200?random=' + Math.random();
}

const botao = document.getElementById('meuBotao');
if (botao) {
    botao.addEventListener('click', () => {
        window.location.href = 'login.html'; 
    });
}

const formDemo = document.getElementById('formDemo');
const outSubmit = document.getElementById('outSubmit');

if (formDemo) {
    formDemo.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const nomeDigitado = document.getElementById('nome').value;
        const idadeDigitada = document.getElementById('idade').value;
        
        outSubmit.textContent = `Cadastro realizado! Bem-vindo(a), ${nomeDigitado}. Você tem ${idadeDigitada} anos.`;
        
        formDemo.reset();
    });
}