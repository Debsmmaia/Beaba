//upload
const dropArea = document.getElementById('drop-area');
const progressBar = document.getElementById('barra');
const fileInfo = document.getElementById('informacao');

let template_usado

function closeModalPerfil(){
    modalperfil.classList.remove('activeperfil');
}

function openUploadModal(idtemplate) {
    const modal = document.querySelector('.modalContainerUpload');
    modal.style.display = 'flex';
    console.log("chamando")
    template_usado = idtemplate;
}

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

    const userData = sessionStorage.getItem('userData');
    const userDataS = JSON.parse(userData);
    const token = userDataS.token;
    const idusuario = userDataS.idusuario;

    console.log(token)

    const formData = new FormData();
    formData.append('file', file);
    formData.append('template_usado', template_usado);
    formData.append('usuario', idusuario);
    
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
             console.log("erro")
        }
    };

    xhr.send(formData);
}

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const file = document.getElementById('arquivoUpload').files[0];
    uploadFile(file);
});