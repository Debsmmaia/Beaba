const userData = sessionStorage.getItem('userData');
const userDataS = JSON.parse(userData);
const tipo_perfil = userDataS.tipo_perfil;

const nome = userDataS.nome_funcionario;
const spanNomeUsuario = document.getElementById('botaoPerfil');
spanNomeUsuario.innerHTML = nome;

if (tipo_perfil === 'Administrador') {
    botaoDash.style.display = 'inline-block';
    botaoAdcUser.style.display = 'inline-block';
}


const adicionar = document.getElementById('formulario')

adicionar.addEventListener('submit', function (event) {
    event.preventDefault();
    const { nome, email, matricula, nivelAcesso } = event.target

    const user = {
        nome_funcionario: nome.value,
        email: email.value,
        matricula: matricula.value,
        senha: "Quero@2023#",
        tipo_perfil: nivelAcesso.value,
    }


    async function enviarDadosParaServidor() {
        const url = 'http://localhost:3003/usuario/usuariosPost';
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "X-Requested-With": "XMLHttpRequest",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
    
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
    
            const responseData = await response.json();
    
            const mensagemSucesso = document.getElementById('mensagemSucesso');
            mensagemSucesso.style.display = 'flex';
    
            setTimeout(function () {
                mensagemSucesso.style.display = 'none';
            }, 5000); 
    
    
            console.log('Resposta do servidor:', responseData);
            console.log(response);
    
        } catch (error) {
            console.log('Erro ao fazer a requisição:', error.message);
        }
    }

    async function pesquisarUsuario(matricula) {
        const url = `http://localhost:3003/usuario/buscaMatricula/${matricula}`;
        const token = 'QQ2023Tech5';
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
    
            if(data.usuario && data.usuario.length > 0 && data.usuario[0].matricula){
                return true;
            }else{
                return false;
            }
    
        } catch (error) {
            throw error;
        }
    }    

    async function verificarUsuario() {
        const usuario = await pesquisarUsuario(matricula.value);
    
        if(usuario === true){
            alert("Usuário já existe no banco! Digite outra matrícula");
        }else if(usuario === false){
            await enviarDadosParaServidor();
            limparCampos();
        }
    }    

    verificarUsuario();
    
});

function limparCampos() {
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const matricula = document.getElementById('matricula');
    const nivelAcesso = document.getElementById('nivelAcesso');

    nome.value = '';
    email.value = '';
    matricula.value = '';
    nivelAcesso.value = '';
}


