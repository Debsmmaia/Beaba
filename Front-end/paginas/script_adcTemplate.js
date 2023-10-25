const adicionar = document.getElementById('adicionarCampos');

adicionar.addEventListener('click', function (event) {
    event.preventDefault();
    
    const nome_template = document.getElementById('nomeTemplate').value;
    const tipo_arquivo = document.getElementById('formato').value;

    const userData = sessionStorage.getItem('userData');
    const userDataS = JSON.parse(userData);
    const usuario = userDataS.idusuario;
    

    const template = {
        "nome_template":  nome_template,
        "tipo_arquivo": tipo_arquivo,
        "status": "Desativo",
        "usuario": usuario,
    }

    async function enviarDadosParaServidor() {
        const url = 'http://localhost:3003/template/templatePost';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(template),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            sessionStorage.setItem('templateData', JSON.stringify(template));

            // const mensagemSucesso = document.getElementById('mensagemSucesso');
            // mensagemSucesso.style.display = 'flex';

            // setTimeout(function () {
            //     mensagemSucesso.style.display = 'none';
            // }, 5000); // Esconde a mensagem após 5 segundos (5000 milissegundos)


            console.log('Resposta do servidor:', responseData);
            console.log(response);

        } catch (error) {
            console.log('Erro ao adicionar template:', error.message);
        }
    }

    enviarDadosParaServidor();
    limparCampos();
});

function limparCampos() {
    const nome_template = document.getElementById('nomeTemplate').value = ' ';
    const tipo_arquivo = document.getElementById('formato').value = ' ';
    const qtdCampos = document.getElementById('qtdCampos').value = ' ';
}
