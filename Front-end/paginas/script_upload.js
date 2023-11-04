//upload
const userData = sessionStorage.getItem('userData');
const userDataS = JSON.parse(userData);
const token = userDataS.token;
const idusuario = userDataS.idusuario;

const templateData = sessionStorage.getItem('templateData');
const templateDataS = JSON.parse(templateData);
const idtemplate = templateDataS.idtemplate;

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

function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    formData.append('idtemplate', idtemplate);
    formData.append('idusuario', idusuario);
    
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            progressBar.style.width = percentComplete + '%';
            fileInfo.innerText = 'Carregando... ' + percentComplete.toFixed(2) + '%';
        }
    };

    xhr.open('POST', 'http://localhost:3003/uploads/adicionar-arquivo', true);

    xhr.setRequestHeader('Authorization', 'Bearer ' + token);

    xhr.onload = function () {
        if (xhr.status === 200) {
            fileInfo.innerText = 'Upload completo!';
        } else {
            console.log(error)
        }
    };

    xhr.send(formData);
}

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário
    const file = document.getElementById('arquivoUpload').files[0];
    uploadFile(file);
});

