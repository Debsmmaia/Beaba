//abrir sessão do usuário
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
}

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

        for (const template of templates) {

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
                      <input type="checkbox" class="toggle">
                      ${isAdmin ? '<span class="toggle-button"></span>' : ''}
                  </label>
                    </td>
                </tr>
              </table>

            <div class="fundo" id="fundo"></div>

            <div class="modalContainerUpload"> 
                
            </div>

              
            `;
            templateList.appendChild(templateDiv);

            const toggleButtonElement = document.querySelector('.toggle-button');
            console.log(toggleButtonElement);

            const checkbox = templateDiv.querySelector('.toggle');
            checkbox.addEventListener('click', function () {
                const status = this.closest('.templateGerenciar').querySelector('.status');
                status.textContent = this.checked ? "Habilitado" : "Desabilitado";
            });

        }


    } catch (error) {
        console.error('Erro ao fazer a requisição:', error.message);
    }
}


renderizarTemplate();

