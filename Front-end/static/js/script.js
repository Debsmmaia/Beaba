//Perfil

const modalperfil = document.querySelector('.modalContainerPerfil');
const divInformacoesPerfil = document.getElementById('informacoesPerfil');

function openModalPerfil() {
    modalperfil.classList.add('activeperfil');

    const userData = sessionStorage.getItem('userData');
    const userDataS = JSON.parse(userData);
    const nome = userDataS.nome_funcionario;
    const tipo_perfil = userDataS.tipo_perfil;

    if (!divInformacoesPerfil.querySelector('.tituloPerfil')) {
        const nomeUsuario = document.createElement('span');
        nomeUsuario.classList.add('tituloPerfil');
        const perfil = document.createElement('small');
        const br = document.createElement('br');

        nomeUsuario.innerHTML = `${nome}`;
        perfil.innerHTML = `${tipo_perfil}`;

        divInformacoesPerfil.appendChild(nomeUsuario);
        divInformacoesPerfil.appendChild(br);
        divInformacoesPerfil.appendChild(perfil);
        divInformacoesPerfil.appendChild(br.cloneNode());
    }
}

function closeModalPerfil() {
    modalperfil.classList.remove('activeperfil');
}


function closeUploadModal() {
    const modal = document.querySelector('.modalContainerUpload');
    modal.style.display = 'none';

    const modalArq = document.getElementById('modalArquivo'); 
    modalArq.style.display = 'none';

    const modalUpload = document.querySelector('.modalUpload'); 
    modalUpload.style.height = '100px';
    modalUpload.style.width = '500px';

    const modalRep = document.getElementById('modalReposit');
    modalRep.style.display = 'flex';

    const selectRepositorio = document.getElementById('repositorio');
    selectRepositorio.value = "";

    const divInformacao = document.getElementById('informacao');
    divInformacao.innerHTML = ' ';

    fundoClose();
}

//upload

let template_usado

function fundoOpen() {
    document.getElementById("fundo").style.display = "block";
}

function fundoClose() {
    document.getElementById("fundo").style.display = "none";
}

function openUploadModal(idtemplate) {
    const modal = document.querySelector('.modalContainerUpload');
    modal.style.display = 'flex';
    
    let template_usado = idtemplate;
    let template= document.createElement('input');
    template.type = 'hidden';
    template.value = template_usado;
    template.classList.add('templateUsado');
    document.body.appendChild(template);
    fundoOpen();
}

//fundo escuro do modal - perfil
document.getElementById("botaoPerfil").addEventListener("click", function () {
    console.log("chamando");
    fundoOpen();
});

document.querySelector(".botaoXPerfil").addEventListener("click", function () {
    fundoClose();
});

//fundo escuro do modal - upload
document.querySelector(".botaoUpload").addEventListener("click", function () {
    fundoOpen();
});

document.querySelector(".botaoXUpload").addEventListener("click", function () {
    fundoClose();
});