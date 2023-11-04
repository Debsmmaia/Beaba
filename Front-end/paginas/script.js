//Notificações

const modal = document.querySelector('.modalContainer')

function openModal(){
    modal.classList.add('active')
}

function closeModal(){
    modal.classList.remove('active')
}

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

function closeModalPerfil(){
    modalperfil.classList.remove('activeperfil');
}

//upload
function openUploadModal() {
    const modal = document.querySelector('.modalContainerUpload');
    modal.style.display = 'flex';
    console.log("chamando")
}

function closeUploadModal() {
    const modal = document.querySelector('.modalContainerUpload');
    modal.style.display = 'none';
}

//fundo escuro do modal - notificação
document.getElementById("notificacao").addEventListener("click", function(){
    document.getElementById("fundo").style.display = "block";
});

document.querySelector(".botaoX").addEventListener("click", function(){
    document.getElementById("fundo").style.display = "none";
});

//fundo escuro do modal - perfil
document.getElementById("botaoPerfil").addEventListener("click", function(){
    document.getElementById("fundo").style.display = "block";
});

document.querySelector(".botaoXPerfil").addEventListener("click", function(){
    document.getElementById("fundo").style.display = "none";
});

//fundo escuro do modal
document.querySelector(".botaoUpload").addEventListener("click", function(){
    document.getElementById("fundo").style.display = "block";
});

document.querySelector(".botaoXUpload").addEventListener("click", function(){
    document.getElementById("fundo").style.display = "none";
});




