const enviar = document.getElementById('enviarForm');

enviar.addEventListener('click', function (event) {
    event.preventDefault();
    
    const nomeCampo = document.getElementsByClassName('camposAdcTemplate').value;
    const tipo_dado = document.getElementsByClassName('campoSelect').value;
    const campoNulo = document.getElementsByClassName('camposNulo').value;

    if(campoNulo == 'Sim'){
        campoNulo = true;
    }else if(campoNulo == 'Não'){
        campoNulo = false;
    }

    const templateData = sessionStorage.getItem('templateData');
    const templateDataS = JSON.parse(templateData);
    const templatePertencente = templateDataS.idtemplate;

    console.log(templateDataS.idtemplate);

    const campo = {
        "nome_campo":  nomeCampo,
        "tipo_dado": tipo_dado,
        "nulo": campoNulo,
        "template_pertencente": templatePertencente.idtemplate,
    }

    sessionStorage.setItem('templateData', JSON.stringify(template));

    async function enviarDadosParaServidor() {
        const url = 'http://localhost:3003/campos/camposPost';

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
            sessionStorage.setItem('camposData', JSON.stringify(campo));

            console.log('Resposta do servidor:', responseData);
            console.log(response);

        } catch (error) {
            console.log('Erro ao fazer a requisição:', error.message);
        }
    }

    enviarDadosParaServidor();
    limparCampos();
});

