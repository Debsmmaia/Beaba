const dropArea = document.getElementById('drop-area');
const progressBar = document.getElementById('barra');
const fileInfo = document.getElementById('informacao');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; // Captura o arquivo solto na área de drop
    fileInfo.textContent = `Arquivo: ${file.name}`;
    uploadFile(file); 
});

document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    document.getElementById('uploadForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const file = document.getElementById('arquivoUpload').files[0];
        uploadFile(file);
    });
});

async function uploadFile(file) {

    if (!file) {
        alert('Selecione um arquivo para enviar');
        return;
    }

    try {
        const userData = sessionStorage.getItem('userData');
        const userDataS = JSON.parse(userData);

        const token = userDataS.token;
        const idusuario = userDataS.idusuario;

        const template_usado = document.querySelector('.templateUsado').value;
        const repositorio = document.getElementById('repositorio').value;

        const formData = new FormData();
        formData.append('file', file);

        if (repositorio === "Repositório 01") {
            const response = await fetch(`http://localhost:5000/uploadRep1/${template_usado}`, {
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

           alert("Upload concluído com sucesso!");
            closeUploadModal();
        } else if (repositorio === "Repositório 02") {
            const response = await fetch(`http://localhost:5000/uploadRep2/${template_usado}`, {
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

            alert("Upload concluído com sucesso!");
            closeUploadModal();
        } else if (repositorio === "Repositório 03") {
            const response = await fetch(`http://localhost:5000/uploadRep3/${template_usado}`, {
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

            alert("Upload concluído com sucesso!");
            closeUploadModal();
        }


    } catch (error) {
        console.error(error);
        alert(`Ocorreu um erro durante o upload: ${error.message}`);
    }
}

const repositorio = document.getElementById('repositorio');
repositorio.addEventListener('input', function() {
    const modal = document.getElementById('modalArquivo');
    modal.style.display = 'flex';

    const modalRep = document.getElementById('modalReposit');
    modalRep.style.display = 'none';

    const modalUpload = document.querySelector('.modalUpload'); 
    modalUpload.style.height = '350px';
    modalUpload.style.width = '650px';
});


