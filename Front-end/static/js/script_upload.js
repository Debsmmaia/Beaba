const dropArea = document.getElementById('drop-area');
const progressBar = document.getElementById('barra');
const fileInfo = document.getElementById('informacao');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; // Captura o arquivo solto na área de drop
    fileInfo.textContent = `Nome do arquivo: ${file.name}`;

    uploadFile(file); // Inicia o upload do arquivo solto
});

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        const file = document.getElementById('arquivoUpload').files[0];
        uploadFile(file);
    });
});

async function uploadFile(file) {
    try {
        const userData = sessionStorage.getItem('userData');
        const userDataS = JSON.parse(userData);

        const token = userDataS.token;
        const idusuario = userDataS.idusuario;

        const template_usado = document.querySelector('.templateUsado').value;

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`http://localhost:5000/upload/${template_usado}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erro ao enviar arquivo: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.download_link);

        const dados = {
            "caminho_arquivo": data.download_link,
            "usuario": idusuario,
            "template_usado": template_usado,
        }

        const upload = await fetch('http://localhost:3003/uploads/adicionarUpload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!upload.ok) {
            throw new Error(`Erro ao adicionar upload: ${upload.statusText}`);
        }

        console.log("Upload concluído com sucesso!");
        closeUploadModal();
    } catch (error) {
        console.error(error);
        alert(`Ocorreu um erro durante o upload: ${error.message}`);
    }
}
