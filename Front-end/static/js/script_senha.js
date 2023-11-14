const adicionar = document.getElementById('mudarSenha');

adicionar.addEventListener('submit', function (event) {
    event.preventDefault();
    const senhaAtual = document.getElementById('senhaAtual').value;
    const senhaNova = document.getElementById('senhaNova').value;
    const senhaNovaConfirmacao = document.getElementById('senhaNovaConfirmacao').value;

    if (senhaNova === senhaNovaConfirmacao) {

        const userData = sessionStorage.getItem('userData');
        const userDataS = JSON.parse(userData);
        const idusuario = userDataS.idusuario;

        const user = {
            idusuario: idusuario,
            senha: senhaNova,
        };

        async function enviarDadosParaServidor() {
            const url = `http://localhost:3003/usuario/atualizarSenha`;

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                }

                const responseData = await response.json();

                alert("Senha atualizada com sucesso!");
                limparCampos();
            } catch (error) {
                console.log('Erro ao fazer a requisição:', error.message);
            }
        }

        enviarDadosParaServidor();

    } else {
        console.log('A nova senha e a confirmação não coincidem');
        alert("A nova senha e a confirmação não coincidem");
    }
});

function limparCampos() {
    document.getElementById('senhaAtual').value = '';
    document.getElementById('senhaNova').value = '';
    document.getElementById('senhaNovaConfirmacao').value = '';
}