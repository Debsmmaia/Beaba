async function renderizarUpload() {
    const url = 'http://localhost:3003/uploads/uploadsGet';

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


        const uploadList = document.getElementById('containerTemplateUpload');
        const uploads = await response.json();

        for (const upload of uploads) {
            if (userDataS.idusuario === upload.usuario) { //mostra todos os templates para os administrativos 
                    const templateDiv = document.createElement('div');
                    templateDiv.classList.add('templateGerenciar');
                    templateDiv.innerHTML = `
                    <table width="100%">
                    <tr>
                    <td>
                        <span class="esquerda">${upload.idupload}</span>
                    </td>
                    <td>
                        <span class="esquerda">${upload.data_criacao}</span>
                    </td>
                    <td>
                        <button class="botaoBranco direita botaoDownload" >Download</button>
                    </td>
                    </tr>
                </table>
                `;

                    
                    uploadList.appendChild(templateDiv);

                    
            }
        }

    }catch (error) {
        console.error('Erro ao fazer a requisição:', error.message);
    }
}

renderizarUpload();
