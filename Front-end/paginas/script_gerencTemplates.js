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


const dropArea = document.getElementById('drop-area');
const progressBar = document.getElementById('barra');
const fileInfo = document.getElementById('informacao');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    fileInfo.textContent = `Nome do arquivo: ${file.name}`;
    simulateFileUpload(file);
});

function simulateFileUpload(file) {

    const totalSize = file.size;
    let uploadedSize = 0;

    const uploadInterval = 200;

    const uploadTimer = setInterval(() => {
        uploadedSize += 10000;

        // Atualizar a barra de progresso
        const progress = (uploadedSize / totalSize) * 100;
        progressBar.style.width = progress + '%';

        if (uploadedSize >= totalSize) {
            clearInterval(uploadTimer);
        }
    }, uploadInterval);
}

function openModalUpload() {
    const modalupload = document.querySelector('.modalUpload');
    modalupload.style.display = 'block';
    console.log("chamando")
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("botaoUpload")) {
        openModalUpload();
    }
});


function closeModalUpload() {
    const modalupload = document.querySelector('.modalUpload');
    modalupload.style.display = 'none';
}

async function renderizarTemplate() {
    const url = 'http://localhost:3003/template/templateGet';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        let isAdmin = false;
        if (tipo_perfil === "Administrador") {
            isAdmin = true;
        }

        const templateList = document.getElementById('containerTemplate');
        const templates = await response.json();

        const userData = sessionStorage.getItem('userData');
        const userDataS = JSON.parse(userData);

        for (const template of templates) {

            if (userDataS.tipo_perfil === "Comum" && template.status === "Ativo") {
                if (template.aprovacao === "Aprovado") { //so visualiza se o template tiver sido aprovado
                    const templateDiv = document.createElement('div');
                    templateDiv.classList.add('templateGerenciar');
                    templateDiv.innerHTML = `
                    <table width="100%">
                    <tr>
                    <td>
                        <span class="esquerda">${template.nome_template}</span>
                    </td>
                    <td>
                        <span class="esquerda">${template.tipo_arquivo}</span>
                    </td>
                    <td>
                        <button class="botaoBranco direita">Download</button>
                    </td>
                    <td>
                    <button class="botaoBranco" class="botaoUpload" onclick="openModalUpload()">Upload</button>
                    </td>
                    <td>
                    <label class="switch">
                            <input type="checkbox" id="toggle">
                            ${isAdmin ? ' <span class="slider" id="botaoStatus" ></span>' : ''}
                        </label>  
                    </td>
                    </tr>
                </table>
                `;

                    const toggleElement = templateDiv.querySelector("#toggle");

                    if (toggleElement) {
                        toggleElement.checked = template.status === "Ativo";

                        toggleElement.addEventListener("change", async function () {
                            const novoEstado = this.checked ? "Ativo" : "Desativo";
                            console.log(novoEstado)

                            const ativo = {
                                "idtemplate": template.idtemplate,
                                "status": novoEstado
                            };

                            const desativo = {
                                "idtemplate": template.idtemplate,
                                "status": novoEstado
                            };

                            if (novoEstado === "Ativo") {
                                fetch('http://localhost:3003/template/ativarTemplate', {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(ativo)
                                })
                                    .then(response => {
                                        if (response.ok) {
                                            console.log('Estado do toggle atualizado no banco de dados.');
                                        } else {
                                            console.error('Falha ao atualizar o estado do toggle no banco de dados.');
                                        }
                                    });
                            } else if (novoEstado === "Desativo") {
                                fetch('http://localhost:3003/template/ativarTemplate', {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(desativo)
                                })
                                    .then(response => {
                                        if (response.ok) {
                                            console.log('Estado do toggle atualizado no banco de dados.');
                                        } else {
                                            console.error('Falha ao atualizar o estado do toggle no banco de dados.');
                                        }
                                    });
                            }
                        });
                    } else {
                        console.error("Elemento 'toggle' não encontrado.");
                    }

                    templateList.appendChild(templateDiv);
                }

            } else if (userDataS.tipo_perfil === "Administrador") { //mostra todos os templates para os administrativos 
                if (template.aprovacao === "Aprovado") { //so visualiza se o template tiver sido aprovado
                    const templateDiv = document.createElement('div');
                    templateDiv.classList.add('templateGerenciar');
                    templateDiv.innerHTML = `
                    <table width="100%">
                    <tr>
                    <td>
                        <span class="esquerda">${template.nome_template}</span>
                    </td>
                    <td>
                        <span class="esquerda">${template.tipo_arquivo}</span>
                    </td>
                    <td>
                        <button class="botaoBranco direita botaoDownload" >Download</button>
                    </td>
                    <td>
                    <button class="botaoBranco" class="botaoUpload" onclick="openModalUpload()">Upload</button>
                    </td>
                    <td>
                    <label class="switch">
                            <input type="checkbox" id="toggle">
                            ${isAdmin ? ' <span class="slider" id="botaoStatus" ></span>' : ''}
                        </label>  
                    </td>
                    </tr>
                </table>
                `;

                    const toggleElement = templateDiv.querySelector("#toggle");

                    if (toggleElement) {
                        toggleElement.checked = template.status === "Ativo";

                        toggleElement.addEventListener("change", async function () {
                            const novoEstado = this.checked ? "Ativo" : "Desativo";
                            console.log(novoEstado)

                            const ativo = {
                                "idtemplate": template.idtemplate,
                                "status": novoEstado
                            };

                            const desativo = {
                                "idtemplate": template.idtemplate,
                                "status": novoEstado
                            };

                            if (novoEstado === "Ativo") {
                                fetch('http://localhost:3003/template/ativarTemplate', {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(ativo)
                                })
                                    .then(response => {
                                        if (response.ok) {
                                            console.log('Estado do toggle atualizado no banco de dados.');
                                        } else {
                                            console.error('Falha ao atualizar o estado do toggle no banco de dados.');
                                        }
                                    });
                            } else if (novoEstado === "Desativo") {
                                fetch('http://localhost:3003/template/ativarTemplate', {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(desativo)
                                })
                                    .then(response => {
                                        if (response.ok) {
                                            console.log('Estado do toggle atualizado no banco de dados.');
                                        } else {
                                            console.error('Falha ao atualizar o estado do toggle no banco de dados.');
                                        }
                                    });
                            }
                        });
                    } else {
                        console.error("Elemento 'toggle' não encontrado.");
                    }

                    templateList.appendChild(templateDiv);

                    const botaoDownload = templateDiv.querySelector('.botaoDownload');
                    botaoDownload.addEventListener('click', async () => {
                        if (template.tipo_arquivo === "CSV") {
                            const url = `http://localhost:3003/campos/templateCSV/${template.idtemplate}`;

                            try {
                                const response = await fetch(url, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                });

                                if (response.ok) {
                                    const blob = await response.blob(); //pega a resposta da requisição
                                    const url = window.URL.createObjectURL(blob);  //cria uma url temporária (o arquivo)
                                    const a = document.createElement('a'); //transforma essa url em um elemtno a

                                    a.href = url;  //mostra qual é o link para ser baixado
                                    a.download = `${template.nome_template}.csv`; //nome do download
                                    document.body.appendChild(a); //coloca na tela 
                                    a.click(); //clica no link e inicia o download
                                    window.URL.revokeObjectURL(url); //libera memória
                                    document.body.removeChild(a);  //remove da tela
                                } else {
                                    console.error('Falha na requisição');
                                }
                            } catch (error) {
                                console.error('Erro:', error);
                            }
                        }else if (template.tipo_arquivo === "XLX") {
                            const url = `http://localhost:3003/campos/templateXLX/${template.idtemplate}`;

                            try {
                                const response = await fetch(url, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                });

                                if (response.ok) {
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');

                                    a.href = url;
                                    a.download = `${template.nome_template}.xlsx`;
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                } else {
                                    console.error('Falha na requisição');
                                }
                            } catch (error) {
                                console.error('Erro:', error);
                            }
                        }else if (template.tipo_arquivo === "XLS") {
                            const url = `http://localhost:3003/campos/templateXLS/${template.idtemplate}`;

                            try {
                                const response = await fetch(url, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                });

                                if (response.ok) {
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');

                                    a.href = url;
                                    a.download = `${template.nome_template}.xls`;
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                } else {
                                    console.error('Falha na requisição');
                                }
                            } catch (error) {
                                console.error('Erro:', error);
                            }
                        }
                    });

                }
            }

        }
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error.message);
    }
}

renderizarTemplate();


