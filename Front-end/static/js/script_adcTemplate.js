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

//aparecer botoes dos campos

const qtdCampos = document.getElementById('qtdCampos');
const camposAdicionados = document.getElementById('divDireita');
const adicionarCampos = document.getElementById('adicionarCampos');

adicionarCampos.addEventListener('click', function (event) {
    event.preventDefault();
    const quantidade = parseInt(qtdCampos.value);

    const camposAtuais = camposAdicionados.querySelectorAll('.divCampos');

    if (camposAtuais.length > quantidade) {
        for (let i = quantidade; i < camposAtuais.length; i++) {
            camposAtuais[i].remove();
        }
    }

    for (let i = 0; i < quantidade; i++) {
        const novoCampo = document.createElement('div');
        const novoForm = document.createElement('form');

        const novoLabel = document.createElement('label');
        novoLabel.for = `Conteúdo do campo ${i + 1}`;
        novoLabel.innerText = `Conteúdo do campo ${i + 1}:`;

        const novoInput = document.createElement('input');
        novoInput.type = 'text';
        novoInput.name = `Campo${i + 1}`;
        novoInput.id = `Campo${i + 1}`;

        const novoLabelSelect = document.createElement('label');
        novoLabelSelect.for = `Tipo do dado - campo${i + 1}`;
        novoLabelSelect.innerText = `Tipo do dado - campo ${i + 1}:`;

        const novoSelect = document.createElement('select');
        novoSelect.name = `Tipo de dado${i + 1}`;
        novoSelect.id = `Tipo de dado${i + 1}`;
        const option1 = document.createElement('option');
        option1.value = 'Numero inteiro';
        option1.text = 'Numero inteiro';
        const option2 = document.createElement('option');
        option2.value = 'Palavra';
        option2.text = 'Palavra';
        const option3 = document.createElement('option');
        option3.value = 'Data';
        option3.text = 'Data';
        novoSelect.appendChild(option1);
        novoSelect.appendChild(option2);
        novoSelect.appendChild(option3);

        const novoLabelNulo = document.createElement('label');
        novoLabelNulo.for = `O campo ${i + 1} pode ser nulo?`;
        novoLabelNulo.innerText = `O campo ${i + 1} pode ser nulo?  `;

        const novoNulo = document.createElement('select');
        novoSelect.name = `O campo ${i + 1} pode ser nulo?`;
        novoSelect.id = `O campo ${i + 1} pode ser nulo?`;
        const option5 = document.createElement('option');
        option5.value = 'Sim';
        option5.text = 'Sim';
        const option6 = document.createElement('option');
        option6.value = 'Não';
        option6.text = 'Não';
        novoNulo.appendChild(option5);
        novoNulo.appendChild(option6);

        const lineBreak = document.createElement('br');
        novoInput.classList.add('camposAdcTemplate');
        novoInput.name = `nomeCampo${i}`;
        novoSelect.classList.add('campoSelect');
        novoSelect.name = 'tipoDadoCampo';
        novoCampo.classList.add('divCampos');
        novoNulo.classList.add('camposNulo');
        novoNulo.name = 'campoNulo';
        novoForm.classList.add('camposTemplate');

        novoForm.appendChild(novoLabel);
        novoForm.appendChild(lineBreak);
        novoForm.appendChild(novoInput);
        novoForm.appendChild(lineBreak.cloneNode());
        novoForm.appendChild(novoLabelSelect);
        novoForm.appendChild(lineBreak.cloneNode());
        novoForm.appendChild(novoSelect);
        novoForm.appendChild(lineBreak.cloneNode());
        novoForm.appendChild(novoLabelNulo);
        novoForm.appendChild(novoNulo);
        novoForm.appendChild(lineBreak.cloneNode());
        novoForm.appendChild(lineBreak.cloneNode());
        novoForm.appendChild(lineBreak.cloneNode());

        // Adiciona o formulário com o campo ao novoCampo
        novoCampo.appendChild(novoForm);

        // Adiciona o novoCampo à divDireita
        camposAdicionados.appendChild(novoCampo);
    }

    // Verifica se a quantidade é maior que 0 para mostrar o botão de enviar
    if (quantidade > 0) {
        const botaoEnviar = document.getElementById('enviarForm');
        botaoEnviar.style.display = 'block';
    } else {
        const botaoEnviar = document.getElementById('enviarForm');
        botaoEnviar.style.display = 'none';
    }
});

//adicionar o template 

const adicionar = document.getElementById('adicionarCampos');

adicionar.addEventListener('click', function (event) {
    event.preventDefault();

    const nome_template = document.getElementById('nomeTemplate').value;
    const tipo_arquivo = document.getElementById('formato').value;

    const userData = sessionStorage.getItem('userData');
    const userDataS = JSON.parse(userData);
    const usuario = userDataS.idusuario;


    const template = {
        "nome_template": nome_template,
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

            console.log('Resposta do servidor:', responseData);
            console.log(response);

            sessionStorage.setItem('templateData', JSON.stringify(responseData));

        } catch (error) {
            console.log('Erro ao adicionar template:', error.message);
        }
    }

    enviarDadosParaServidor();
    limparCampos();
});

const enviar = document.getElementById('enviarForm');
enviar.addEventListener('click', async function (event) {
    event.preventDefault();

    const qtdCampos = document.getElementById('qtdCampos').value;

    const valoresNomeCampos = [];
    const valoresTiposDados = [];
    const valoresCamposNulos = [];

    console.log(valoresNomeCampos);

    for (let i = 1; i <= qtdCampos; i++) {
        const nomeCampo = document.getElementsByName(`nomeCampo${i - 1}`)[0].value;
        const tipoDadoCampo = document.getElementsByName('tipoDadoCampo')[i - 1].value;
        const campoNulo = document.getElementsByName('campoNulo')[i - 1].value;
    
        valoresNomeCampos.push(nomeCampo);
        valoresTiposDados.push(tipoDadoCampo);
    
        if (campoNulo === "Sim") {
            valoresCamposNulos.push(true);
        } else if (campoNulo === "Não") {
            valoresCamposNulos.push(false);
        }
    
        const templateData = sessionStorage.getItem('templateData');
        const templateDataS = JSON.parse(templateData);
        const templatePertencente = templateDataS.idtemplate;
    
        const campo = {
            "nome_campo": nomeCampo,
            "tipo_dado": tipoDadoCampo,
            "nulo": campoNulo === "Sim",
            "template_pertencente": templatePertencente,
        };
    
        await enviarDadosParaServidorCampos(campo);
    }
    
});

async function enviarDadosParaServidorCampos(campo) {
    const url = 'http://localhost:3003/campos/camposPost';

    console.log(campo);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(campo),
        });


        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        sessionStorage.setItem('camposData', JSON.stringify(responseData));

        console.log('Resposta do servidor:', responseData);

    } catch (error) {
        console.log('Erro ao fazer a requisição:', error.message);
    }
    
}





