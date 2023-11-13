async function buscarTemplate(template) {

    const url = `http://localhost:3003/template/buscaTemplateId/${template}`;
  
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
  
      const responseData = await response.json();

      console.log(responseData)
  
      if (responseData) {
        return responseData;
      } else {
        throw new Error('template não encontrado.');
      }
    } catch (error) {
      throw error;
    }
}

function formatarData(dataDoBanco) {
  const data = new Date(dataDoBanco);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}


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
            if (userDataS.idusuario === upload.usuario) { 

                console.log(upload)

                    const template = await buscarTemplate(upload.template_usado);
                    const dataFormatada = formatarData(upload.data_criacao);

                    const uploadDiv = document.createElement('div');
                    uploadDiv.classList.add('templateGerenciar');
                    uploadDiv.innerHTML = `
                    <table width="100%">
                    <tr>
                    <td>
                        <span class="esquerda">${template.nome_template}</span>
                    </td>
                    <td>
                        <span class="esquerda">${dataFormatada}</span>
                    </td>
                    <td>
                        <span class="esquerda">${template.tipo_arquivo}</span>
                    </td>
                    <td>
                        <button class="botaoBranco direita botaoDownload" onclick="baixarArquivo('${upload.caminho_arquivo}')">Download</button>
                    </td>
                    </tr>
                </table>
                `;
                   
                uploadList.appendChild(uploadDiv);
            }
        }


    }catch (error) {
        console.error('Erro ao fazer a requisição:', error.message);
    }
}

renderizarUpload();
